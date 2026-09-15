-- Marcus confirmed that the two existing Supabase lifetime members count
-- toward the 20-place offer. Import those memberships, not new payments.
begin;
do $$
declare changed integer;
begin
  perform 1 from public.founding_inventory where singleton for update;
  if not exists(select 1 from public.founding_inventory where singleton and not initialized) then
    raise exception 'Inventory already enabled or missing';
  end if;
  if (select count(*) from public.profiles where lifetime_creator=true) <> 2 then
    raise exception 'Expected exactly two confirmed existing members';
  end if;
  if (select count(*) from public.founding_slots where state='available') <> 20 then
    raise exception 'Inventory is not empty; reconcile before continuing';
  end if;
  with members as (
    select id::text as owner_id, stripe_customer_id,
      row_number() over (order by id) as slot
    from public.profiles where lifetime_creator=true
  )
  update public.founding_slots s set state='sold',reservation_id=gen_random_uuid(),
    owner_id=m.owner_id,customer_id=m.stripe_customer_id
    from members m where s.slot=m.slot and s.state='available';
  get diagnostics changed = row_count;
  if changed <> 2 then raise exception 'Membership import did not claim exactly two places'; end if;
  update public.founding_inventory set initialized=true where singleton;
end $$;
select state, count(*) as places from public.founding_slots group by state order by state;
commit;
