-- Apply before enabling the corrected checkout on BOTH domains.
-- Inventory starts CLOSED. Import all historical paid and open Founding
-- Checkouts before marking initialized=true (see FOUNDING-ROLLOUT.md).
create table if not exists public.founding_inventory (
  singleton boolean primary key default true check (singleton),
  initialized boolean not null default false
);
insert into public.founding_inventory(singleton) values(true) on conflict do nothing;
create table if not exists public.founding_slots (
  slot integer primary key check (slot between 1 and 20),
  reservation_id uuid unique,
  owner_id text,
  customer_id text,
  state text not null default 'available' check (state in ('available','held','sold')),
  session_id text unique,
  checkout_expires_at bigint,
  check ((state='available' and reservation_id is null and owner_id is null and session_id is null)
    or (state in ('held','sold') and reservation_id is not null))
);
insert into public.founding_slots(slot) select generate_series(1,20) on conflict do nothing;
create unique index if not exists founding_one_owner on public.founding_slots(owner_id) where owner_id is not null;
alter table public.founding_inventory enable row level security;
alter table public.founding_slots enable row level security;
revoke all on public.founding_inventory, public.founding_slots from anon, authenticated;
grant all on public.founding_inventory, public.founding_slots to service_role;

create or replace function public.reserve_founding_slot(p_owner text, p_customer text)
returns setof public.founding_slots language plpgsql security definer set search_path=public as $$
declare selected public.founding_slots;
begin
  -- One transaction serializes admission across processes and domains.
  perform 1 from public.founding_inventory where singleton for update;
  if not exists(select 1 from public.founding_inventory where initialized) then
    raise exception 'founding_inventory_unavailable';
  end if;
  if p_owner is null or p_owner='' or p_customer is null or p_customer='' then
    raise exception 'invalid_owner';
  end if;
  select * into selected from public.founding_slots where owner_id=p_owner;
  if found then return next selected; return; end if;
  select * into selected from public.founding_slots where state='available' order by slot limit 1 for update;
  if not found then return; end if;
  update public.founding_slots set state='held', owner_id=p_owner,
    customer_id=p_customer, reservation_id=gen_random_uuid(),
    checkout_expires_at=extract(epoch from now())::bigint+3600
    where slot=selected.slot returning * into selected;
  return next selected;
end $$;
revoke all on function public.reserve_founding_slot(text,text) from public;
grant execute on function public.reserve_founding_slot(text,text) to service_role;
