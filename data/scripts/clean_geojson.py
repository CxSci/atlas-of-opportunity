import argparse
import json
import sys


def main(args):
    if args.input:
        in_path = args.input
    else:
        in_path = sys.stdin

    if args.in_place:
        out_path = in_path
    elif args.output:
        out_path = args.output
    else:
        out_path = sys.stdout

    with open(in_path, "r", encoding="utf-8") as fp:
        data = json.load(fp)
    # Remove features which lack geometry. Mapbox Tiling Service CLI chokes
    # on GeoJSON with geometry-free features.
    data["features"] = [f for f in data["features"] if f["geometry"]]
    with open(out_path, "w", encoding="utf-8") as fp:
        json.dump(data, fp, ensure_ascii=False)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description=(
            "Clean geometry-free features from a GeoJSON file to make "
            "it suitable for input to Mapbox Tilesets CLI."
        )
    )
    parser.add_argument(
        "-i",
        "--input",
        type=str,
        help="Read from a file instead of stdin",
    )
    group = parser.add_mutually_exclusive_group()
    group.add_argument(
        "--in-place",
        action="store_true",
        help=("Overwrite the existing GeoJSON file"),
    )
    group.add_argument(
        "-o",
        "--output",
        type=str,
        help="Write to a file instead of stdout",
    )
    args = parser.parse_args()
    if args.in_place and not args.input:
        parser.error(
            "argument --in-place not allowed without argument -i/--input"
        )

    main(args)
