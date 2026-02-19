-- Atomic increment for sold_tickets on ticket_types
-- Avoids read-then-write race conditions during concurrent purchases
create or replace function increment_sold_tickets(
  p_ticket_type_id uuid,
  p_amount integer
)
returns void
language sql
security definer
as $$
  update ticket_types
  set sold_tickets = sold_tickets + p_amount
  where id = p_ticket_type_id;
$$;
