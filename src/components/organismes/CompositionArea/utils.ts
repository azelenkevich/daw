import { KonvaEventObject } from 'konva/lib/Node';
import { Stage } from 'konva/lib/Stage';

type StageScaleHandlerProps = {
  stage: Stage;
  oldScale: number;
  scaleBy: number;
  event: KonvaEventObject<WheelEvent>;
};

export const stageScaleHandler = ({
  stage,
  oldScale,
  scaleBy,
  event,
}: StageScaleHandlerProps): void => {
  const pointer = stage.getPointerPosition();

  if (!pointer) return;

  const mousePointTo = {
    x: (pointer.x - stage.x()) / oldScale,
    y: (pointer.y - stage.y()) / oldScale,
  };

  let direction = -(event.evt.deltaY > 0 ? 1 : -1);

  // if (event.evt.ctrlKey) {
  //   direction = -direction;
  // }

  const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

  if (newScale <= 1) return;

  stage.scaleX(newScale);

  const newXPosition = pointer.x - mousePointTo.x * newScale;

  stage.position({
    x: newXPosition < 0 ? newXPosition : 0,
    y: 0,
  });
};
