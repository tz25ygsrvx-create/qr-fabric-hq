ALTER TABLE public.fabric_skus ADD COLUMN IF NOT EXISTS type text;

UPDATE public.fabric_skus
SET type = CASE
  WHEN category IN ('Blackout', 'Naktiniai', 'Aksomas') THEN 'Naktiniai'
  ELSE 'Dieniniai'
END
WHERE type IS NULL;

ALTER TABLE public.fabric_skus ALTER COLUMN type SET DEFAULT 'Dieniniai';
ALTER TABLE public.fabric_skus ALTER COLUMN type SET NOT NULL;