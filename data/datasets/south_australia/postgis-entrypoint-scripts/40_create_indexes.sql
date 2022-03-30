-- A second index on geom, this time for when it's cast as a geography
CREATE INDEX IF NOT EXISTS sa2_2016_aust_geom_idx
    ON public.sa2_2016_aust USING gist
    ((geom::geography))
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS sa2_2016_aust_sa2_name16_idx
    ON public.sa2_2016_aust USING btree
    (sa2_name16 COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;
