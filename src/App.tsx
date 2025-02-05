import { useCallback, useRef, useState } from "react"
import { Arrow as KonvaArrow, Circle as KonvaCircle, Layer, Rect as KonvaRect, Stage } from "react-konva"
import Toolbar from "./components/toolbar"
import { ToolEnum } from "./utils/selectedTool.enum"
import { Rectangle, Arrow, Circle } from "./utils/shapes.type"
import Konva from "konva"

function App() {
  const [rectangle, setRectangle] = useState<Rectangle[]>([])
  const [arrow, setArrow] = useState<Arrow[]>([])
  const [circle, setCircle] = useState<Circle[]>([])
  const stageRef = useRef<Konva.Stage>(null)
  const isDrawingRef = useRef(false)
  const [tool, setTool] = useState<ToolEnum>(ToolEnum.Select)

  const currentShapeRef = useRef<string>()

  const mouseDownHandler = useCallback(() => {
    console.log(tool);

    if (tool === ToolEnum.Select) return
    isDrawingRef.current = true
    const stage = stageRef.current
    const position = stage?.getPointerPosition()
    const x: number = position?.x || 0
    const y: number = position?.y || 0
    const id = crypto.randomUUID()
    currentShapeRef.current = id

    switch (tool) {
      case ToolEnum.Rectangle: {
        setRectangle(prev => [...prev, { id, x, y, height: 1, width: 1 }])
        break
      }
      case ToolEnum.Arrow: {
        setArrow(prev => [...prev, { id, points: [x, y, x, y] }])
        break
      }
      case ToolEnum.Circle: {
        setCircle(prev => [...prev, { id, x, y, radius: 1 }])
        break
      }
      case ToolEnum.Eraser: {
        setRectangle(prev => prev.filter(rect => !(x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height)))

        setCircle(prev => prev.filter(cir =>
          !((x - cir.x) ** 2 + (y - cir.y) ** 2 <= cir.radius ** 2)
        ))

        setArrow(prev => prev.filter(arr => {
          // Simple distance check from point to line segment
          const [x1, y1, x2, y2] = arr.points
          const distance = Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1) /
            Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2)
          return distance > 10 // threshold for eraser
        }))
      }
    }

  }, [tool])


  const mouseMoveHandler = useCallback(() => {
    if (!isDrawingRef.current || tool === ToolEnum.Select) return
    const stage = stageRef.current
    const position = stage?.getPointerPosition()
    const x = position?.x || 0
    const y = position?.y || 0

    switch (tool) {
      case ToolEnum.Eraser: {
        mouseDownHandler()
        break
      }

      case ToolEnum.Rectangle: {
        setRectangle(prev => (prev.map(rect => rect.id === currentShapeRef.current ? { ...rect, height: y - rect.y, width: x - rect.x } : rect)))
        break;
      }

      case ToolEnum.Arrow: {
        setArrow(prev => (prev.map(arr => arr.id === currentShapeRef.current ? { ...arr, points: [arr.points[0], arr.points[1], x, y] } : arr)))
        break
      }

      case ToolEnum.Circle: {
        setCircle(prev => prev.map(cir => cir.id === currentShapeRef.current ? { ...cir, radius: ((x - cir.x) ** 2 + (y - cir.y) ** 2) ** 0.5 } : cir))
        break
      }
    }

  }, [tool, mouseDownHandler])

  const mouseUpHandler = () => {
    isDrawingRef.current = false
  }


  return (
    <>
      <Toolbar tool={tool} setSelectedTool={setTool} />
      <Stage
        ref={stageRef}
        width={innerWidth}
        height={innerHeight}
        onMouseDown={mouseDownHandler}
        onMouseMove={mouseMoveHandler}
        onMouseUp={mouseUpHandler}
        onTouchStart={mouseDownHandler}
        onTouchMove={mouseMoveHandler}
        onTouchEnd={mouseUpHandler}
        className={`${tool === ToolEnum.Select ? "cursor-default" : "cursor-crosshair"}`}
      >
        <Layer>
          {
            rectangle.map(rect =>
              <KonvaRect
                x={rect?.x}
                y={rect?.y}
                width={rect?.width}
                height={rect?.height}
                fill="red"
                stroke='black'
                draggable={tool === ToolEnum.Select}
              />)
          }

          {
            arrow && arrow.map(arr =>
              <KonvaArrow
                points={arr.points}
                fill={"black"}
                strokeWidth={100}
                stroke={"black"}
                draggable={tool === ToolEnum.Select}
              />
            )
          }

          {
            circle && circle.map(cir =>
              <KonvaCircle
                x={cir.x}
                y={cir.y}
                radius={cir.radius}
                stroke={"black"}
                draggable={tool === ToolEnum.Select}
              />
            )
          }

        </Layer>

      </Stage >
    </>
  )
}

export default App
