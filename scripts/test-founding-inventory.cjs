// Run with: NODE_PATH=/path/to/pglite/node_modules node scripts/test-founding-inventory.cjs
// Executes the actual migration and admission function against isolated PostgreSQL (PGlite).
const {PGlite}=require('@electric-sql/pglite');
const {readFileSync}=require('node:fs');
const assert=require('node:assert/strict');
(async()=>{
 const db=new PGlite();
 await db.exec('create role anon; create role authenticated; create role service_role;');
 await db.exec(readFileSync('scripts/20260915_founding_inventory.sql','utf8'));
 await assert.rejects(db.query('select * from reserve_founding_slot($1,$2)',['closed','cus_closed']),/unavailable/);
 await db.exec('update founding_inventory set initialized=true');
 const attempts=await Promise.all(Array.from({length:25},(_,i)=>db.query('select * from reserve_founding_slot($1,$2)',['owner'+i,'cus_'+i])));
 assert.equal(attempts.filter(r=>r.rows.length).length,20);
 const same=await db.query('select * from reserve_founding_slot($1,$2)',['owner0','cus_new']);
 assert.equal(same.rows[0].reservation_id,attempts[0].rows[0].reservation_id);
 assert.equal(same.rows[0].customer_id,'cus_0');
 await db.exec("update founding_slots set checkout_expires_at=1 where slot=20");
 assert.equal((await db.query("select * from reserve_founding_slot('later','cus_later')")).rows.length,0,'clock expiry alone must never release a slot');
 await db.exec("update founding_slots set state='sold' where slot=1");
 assert.equal((await db.query("select * from reserve_founding_slot('owner0','cus_0')")).rows[0].state,'sold');
 await assert.rejects(db.exec('insert into founding_slots(slot) values (21)'),/check constraint/);
 await db.exec("update founding_slots set state='available',reservation_id=null,owner_id=null,customer_id=null,session_id=null,checkout_expires_at=null where slot=20");
 assert.equal((await db.query("select * from reserve_founding_slot('replacement','cus_replacement')")).rows[0].slot,20);
 await db.exec('set role anon');
 await assert.rejects(db.query("select * from reserve_founding_slot('intruder','cus_bad')"),/permission denied/);
 await assert.rejects(db.query('select * from founding_slots'),/permission denied/);
 await db.close();
 console.log('PASS: closed inventory, 25 admission attempts/20 places, repeat-owner retry, no clock-based release, sold owner, slot-21 constraint, replacement, anonymous denial.');
})().catch(e=>{console.error(e);process.exitCode=1});
