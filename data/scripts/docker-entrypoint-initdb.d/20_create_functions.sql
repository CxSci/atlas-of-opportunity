-- FUNCTION: public.mitcxi_escribed_square_bbox(box2d)

-- DROP FUNCTION IF EXISTS public.mitcxi_escribed_square_bbox(box2d);

CREATE OR REPLACE FUNCTION public.mitcxi_escribed_square_bbox(
    in_bbox box2d)
    RETURNS box2d
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    center geometry;
    length float;
BEGIN
    SELECT ST_Centroid(in_bbox)
    INTO center;
    SELECT greatest(
      (ST_XMax(in_bbox) - ST_XMin(in_bbox)) / 2,
      (ST_YMax(in_bbox) - ST_YMin(in_bbox)) / 2
    )
    INTO length;
    RETURN ST_SetSRID(
        ST_MakeBox2D(
            ST_Point(
                ST_X(center) - length,
                ST_Y(center) - length
            ),
            ST_Point(
                ST_X(center) + length,
                ST_Y(center) + length
            )
        ),
        ST_SRID(in_bbox)
    );
END;
$BODY$;

ALTER FUNCTION public.mitcxi_escribed_square_bbox(box2d)
    OWNER TO postgres;

COMMENT ON FUNCTION public.mitcxi_escribed_square_bbox(box2d)
    IS 'Returns a square box2d which fits in_bbox';



-- FUNCTION: public.mitcxi_scaled_bbox(box2d, numeric, numeric)

-- DROP FUNCTION IF EXISTS public.mitcxi_scaled_bbox(box2d, numeric, numeric);

CREATE OR REPLACE FUNCTION public.mitcxi_scaled_bbox(
    in_bbox box2d,
    x_scale numeric,
    y_scale numeric)
    RETURNS box2d
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    center geometry;
    x_length float;
    y_length float;
BEGIN
    SELECT ST_Centroid(in_bbox) INTO center;
    SELECT (ST_XMax(in_bbox) - ST_XMin(in_bbox)) / 2 INTO x_length;
    SELECT (ST_YMax(in_bbox) - ST_YMin(in_bbox)) / 2 INTO y_length;
    RETURN ST_SetSRID(
        ST_MakeBox2D(
            ST_Point(
                ST_X(center) - x_length * x_scale,
                ST_Y(center) - y_length * y_scale
            ),
            ST_Point(
                ST_X(center) + x_length * x_scale,
                ST_Y(center) + y_length * y_scale
            )
        ),
        ST_SRID(in_bbox)
    );
END;
$BODY$;

ALTER FUNCTION public.mitcxi_scaled_bbox(box2d, numeric, numeric)
    OWNER TO postgres;

COMMENT ON FUNCTION public.mitcxi_scaled_bbox(box2d, numeric, numeric)
    IS 'Returns a box2d with the same center as in_bbox but scaled in size';



-- FUNCTION: public.mitcxi_asarray(box2d)

-- DROP FUNCTION IF EXISTS public.mitcxi_asarray(box2d);

CREATE OR REPLACE FUNCTION public.mitcxi_asarray(
    bbox box2d)
    RETURNS double precision[]
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN
    return array[
      ST_XMin(bbox), ST_YMin(bbox),
      ST_XMax(bbox), ST_YMax(bbox)
    ];
END;
$BODY$;

ALTER FUNCTION public.mitcxi_asarray(box2d)
    OWNER TO postgres;

COMMENT ON FUNCTION public.mitcxi_asarray(box2d)
    IS 'Returns a flat array like { xmin, ymin, xmax, ymax } for a given box2d';



-- FUNCTION: public.mitcxi_asarray(geometry)

-- DROP FUNCTION IF EXISTS public.mitcxi_asarray(geometry);

CREATE OR REPLACE FUNCTION public.mitcxi_asarray(
    g geometry)
    RETURNS double precision[]
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN
    RETURN CASE
        WHEN ST_GeometryType(g) = 'ST_Point' THEN
           array[
              ST_X(g),
              ST_Y(g)
          ]
        WHEN ST_GeometryType(g) = 'ST_Polygon' THEN
            array[
                ST_XMin(g), ST_YMin(g),
                ST_XMax(g), ST_YMax(g)
            ]
        ELSE
          array[]::double precision[]
    END;
END;
$BODY$;

ALTER FUNCTION public.mitcxi_asarray(geometry)
    OWNER TO postgres;

COMMENT ON FUNCTION public.mitcxi_asarray(geometry)
    IS 'Returns a flat array like { x, y } for a given point. Returns a flat array like { xmin, ymin, xmax, ymax } for other types of geometry.';
