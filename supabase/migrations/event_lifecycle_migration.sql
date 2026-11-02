-- ============================================
-- VOUNCER - EVENT LIFECYCLE MANAGEMENT
-- ============================================

-- 1. ADD SALES_ENDS_AT COLUMN
-- Allows venues to set a specific sales deadline (e.g., 2 hours before event)
ALTER TABLE events
ADD COLUMN IF NOT EXISTS sales_ends_at timestamptz;

COMMENT ON COLUMN events.sales_ends_at IS 'Optional sales deadline. If null, sales close at event_date';

-- 2. ADD SOLD_TICKETS COLUMN
-- Track how many tickets have been sold
ALTER TABLE events
ADD COLUMN IF NOT EXISTS sold_tickets integer DEFAULT 0 NOT NULL;

COMMENT ON COLUMN events.sold_tickets IS 'Number of tickets sold for this event';

-- 3. RENAME STOCK TO TOTAL_TICKETS (Optional, for clarity)
-- If you want to rename 'stock' to 'total_tickets' for better semantics:
-- ALTER TABLE events RENAME COLUMN stock TO total_tickets;
-- For now, we'll keep 'stock' as is and treat it as total_tickets

-- 4. ADD CHECK CONSTRAINT
-- Ensure sold_tickets never exceeds stock
ALTER TABLE events
ADD CONSTRAINT IF NOT EXISTS check_sold_tickets_valid
CHECK (sold_tickets >= 0 AND sold_tickets <= stock);

-- 5. CREATE FUNCTION TO AUTO-UPDATE SOLD_TICKETS
-- This function counts tickets from the tickets table
CREATE OR REPLACE FUNCTION update_event_sold_tickets()
RETURNS TRIGGER AS $$
BEGIN
    -- Update sold_tickets count for the event
    UPDATE events
    SET sold_tickets = (
        SELECT COUNT(*)
        FROM tickets
        WHERE event_id = NEW.event_id
        AND status IN ('paid', 'used')
    )
    WHERE id = NEW.event_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. CREATE TRIGGER TO AUTO-UPDATE ON TICKET PURCHASE
DROP TRIGGER IF EXISTS trigger_update_sold_tickets ON tickets;
CREATE TRIGGER trigger_update_sold_tickets
AFTER INSERT OR UPDATE ON tickets
FOR EACH ROW
EXECUTE FUNCTION update_event_sold_tickets();

-- 7. INITIALIZE SOLD_TICKETS FOR EXISTING EVENTS
-- Run this once to populate sold_tickets for existing events
UPDATE events e
SET sold_tickets = (
    SELECT COUNT(*)
    FROM tickets t
    WHERE t.event_id = e.id
    AND t.status IN ('paid', 'used')
);

-- 8. CREATE VIEW FOR AVAILABLE EVENTS
-- Useful for querying only future, available events
CREATE OR REPLACE VIEW available_events AS
SELECT 
    e.*,
    (e.stock - e.sold_tickets) AS tickets_remaining,
    CASE 
        WHEN e.sold_tickets >= e.stock THEN 'sold_out'
        WHEN e.sales_ends_at IS NOT NULL AND NOW() > e.sales_ends_at THEN 'sales_closed'
        WHEN NOW() > e.event_date THEN 'past'
        ELSE 'available'
    END AS event_status
FROM events e
WHERE e.event_date >= NOW()  -- Only future events
ORDER BY e.event_date ASC;


-- 10. VERIFY THE CHANGES
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'events'
AND column_name IN ('sales_ends_at', 'sold_tickets', 'stock')
ORDER BY column_name;
