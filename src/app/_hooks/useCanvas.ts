import { RefObject, useEffect, useMemo, useRef } from "react";

import { CanvasItem } from "@/app/_types/type";
import { drawBackground, drawPlayer, reDrawCanvas } from "@/app/_utils/canvas";

const useCanvas = () => {
  const backgroundCanvas = useRef<HTMLCanvasElement>(null);
  const playerBackgroundCanvas = useRef<HTMLCanvasElement>(null);
  const gameInfoCanvas = useRef<HTMLCanvasElement>(null);

  const drawGameInfo = (canvas: RefObject<HTMLCanvasElement>) => {};

  const canvases: CanvasItem[] = useMemo(
    () => [
      { ref: backgroundCanvas, drawFn: drawBackground, id: 1 },
      { ref: playerBackgroundCanvas, drawFn: drawPlayer, id: 2 },
      { ref: gameInfoCanvas, drawFn: drawGameInfo, id: 3 },
    ],
    []
  );

  useEffect(() => {
    reDrawCanvas(canvases);

    const handleResize = (canvases: CanvasItem[]) => {
      reDrawCanvas(canvases);
    };

    window.addEventListener("resize", () => handleResize(canvases));

    () => {
      window.removeEventListener("resize", () => handleResize(canvases));
    };
  }, [canvases]);

  return { canvases };
};

export default useCanvas;
