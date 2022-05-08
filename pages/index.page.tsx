import { Fragment } from "react";
import { mapAccum } from "../lib/mapAccum";
import { useWindowSize } from "../lib/useWindowSize";

const u = 24;

const pad = {
  top: 30,
  left: 30,
};

const tracks: TrackData[] = [
  {
    id: 1,
    title: "Markus",
    color: "#4287f5",
    width: 5,
  },
  {
    id: 3,
    title: "Studie",
    color: "#60bd95",
    width: 5,
  },
  {
    id: 2,
    title: "Electronic music",
    color: "#d9298d",
    width: 3,
  },
];

type TrackData = {
  id: number;
  title: string;
  color: string;
  width: number;
};

export default function Home() {
  const size = useWindowSize();

  return (
    <div>
      {size && (
        <svg
          viewBox={`0 0 ${size.width} ${size.height}`}
          className="absolute inset-0 w-full h-full"
        >
          {mapAccum({
            arr: tracks,
            initial: pad.left,
            map(x, track) {
              return [
                x + track.width * u,
                <g key={track.id}>
                  <rect
                    x={x}
                    y={pad.top}
                    width={track.width * u}
                    height={u}
                    fill={track.color}
                  />
                  <svg
                    fontSize={14}
                    x={x}
                    y={pad.top}
                    width={track.width * u}
                    height={u}
                  >
                    <text
                      x={4}
                      y={u * 0.7}
                      fill="white"
                      className="select-none"
                    >
                      {track.title}
                    </text>
                  </svg>
                </g>,
              ];
            },
          })}
          {mapAccum({
            arr: tracks,
            initial: pad.left,
            map(x, track) {
              return [
                x + track.width * u,
                <g key={track.id}>
                  <rect
                    x={x + track.width * u - 10}
                    y={pad.top - 2}
                    width={12}
                    height={u + 4}
                    fill="transparent"
                    className="hover:fill-[#00000066] hover:cursor-col-resize"
                  />
                </g>,
              ];
            },
          })}
        </svg>
      )}
    </div>
  );
}
