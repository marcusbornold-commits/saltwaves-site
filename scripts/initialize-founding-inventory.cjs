// Run with the application's environment loaded. Read-only by default.
// Both old checkout routes MUST be replaced by the guarded version first.
const { createClient } = require('@supabase/supabase-js');
const Stripe = require('stripe');
const { randomUUID } = require('node:crypto');
const apply = process.argv.includes('--apply');
(async () => {
  const stripe = process.argv.includes('--stripe-cli') ? {
    checkout: {sessions: {
      async *list() {
        const {execFileSync}=require('node:child_process');
        let after;
        do {
          const args=['checkout','sessions','list','--live','--limit','100'];
          if(after) args.push('--starting-after',after);
          const page=JSON.parse(execFileSync('/opt/homebrew/bin/stripe',args,{encoding:'utf8',stdio:['ignore','pipe','pipe']}));
          for(const session of page.data) yield session;
          if(!page.has_more) break;
          after=page.data.at(-1).id;
        } while(after);
      },
      async listLineItems(id) {
        const {execFileSync}=require('node:child_process');
        return JSON.parse(execFileSync('/opt/homebrew/bin/stripe',['get',`/v1/checkout/sessions/${id}/line_items?limit=100`,'--live'],{encoding:'utf8',stdio:['ignore','pipe','pipe']}));
      }
    }}
  } : new Stripe(process.env.STRIPE_SECRET_KEY);
  const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {auth:{persistSession:false}});
  const {data:config,error:ce}=await db.from('founding_inventory').select('initialized').single();
  if(ce || config?.initialized) throw Error('Inventory must exist and be closed before import.');
  const prices=new Set([process.env.STRIPE_PRICE_FOUNDING_T1,process.env.STRIPE_PRICE_FOUNDING_T2,
    'price_1ThjzMD9SzEMpfBY2UDkzvYS','price_1ThjqZD9SzEMpfBYTr3tOC6i'].filter(Boolean));
  const sessions=[];
  for await (const s of stripe.checkout.sessions.list({limit:100})) {
    if(s.status==='expired') continue;
    const items=await stripe.checkout.sessions.listLineItems(s.id,{limit:100});
    if(!items.data.some(i=>prices.has(i.price?.id))) continue;
    sessions.push(s);
  }
  if(sessions.length>20) throw Error('More than 20 paid/pending sessions. Reconcile pending checkouts before import.');
  const owners=new Set();
  const rows=sessions.map((s,i)=>{
    const owner=s.client_reference_id || s.metadata?.user_id;
    if(!owner || owners.has(owner)) throw Error('Missing owner or duplicate purchase. Manual reconciliation required.');
    owners.add(owner);
    return {slot:i+1,reservation_id:randomUUID(),owner_id:owner,
      customer_id:typeof s.customer==='string'?s.customer:s.customer?.id,
      state:s.status==='complete'&&s.payment_status==='paid'?'sold':'held',
      session_id:s.id,checkout_expires_at:s.expires_at};
  });
  const {data:members,error:me}=await db.from('profiles').select('id').eq('lifetime_creator',true);
  if(me || members.some(m=>!owners.has(m.id))) throw Error('Existing lifetime membership missing from Stripe import. Reconcile before enabling.');
  console.log(JSON.stringify({paid:rows.filter(r=>r.state==='sold').length,pending:rows.filter(r=>r.state==='held').length,capacity:20,apply}));
  if(!apply) return;
  // Remains closed throughout import. A failed import can be reconciled/retried.
  if(rows.length) {const {error}=await db.from('founding_slots').upsert(rows);if(error) throw Error('Inventory import failed; remains closed.');}
  const {error}=await db.from('founding_inventory').update({initialized:true}).eq('singleton',true).eq('initialized',false);
  if(error) throw Error('Enable failed; inspect inventory before retry.');
})().catch(e=>{console.error(e.message);process.exitCode=1});
