import { Circle, Eraser, MousePointer, MoveRight, Square } from 'lucide-react'
import { ToolEnum } from '../utils/selectedTool.enum'

const Tools = [
    {
        name: "Select",
        type: ToolEnum.Select,
        icon: <MousePointer className='w-4' />
    },
    {
        name: "Arrow",
        type: ToolEnum.Arrow,
        icon: <MoveRight className='w-4' />
    },
    {
        name: "Rectangle",
        type: ToolEnum.Rectangle,
        icon: <Square className='w-4' />
    },
    {
        name: "Circle",
        type: ToolEnum.Circle,
        icon: <Circle className='w-4' />
    },
    {
        name: "Eraser",
        type: ToolEnum.Eraser,
        icon: <Eraser className='w-4' />
    },

]

export default function Toolbar({ tool, setSelectedTool }: { tool: ToolEnum, setSelectedTool: (tool: ToolEnum) => void }) {

    const changeSelectedTool = (newTool: ToolEnum) => {
        setSelectedTool(newTool)
    }

    return (
        <div className='bg-white border-black border/30 shadow-lg flex items-center justify-evenly rounded-lg mt-5 w-[90%] md:w-[80%] lg:w-[30%] mx-auto'>

            {Tools.map(CurrentTool =>
                <button className={`p-2 rounded-lg hover:bg-emerald-50  ${CurrentTool.type === tool ? "bg-emerald-100" : null}  cursor-pointer`} onClick={() => changeSelectedTool(CurrentTool.type)}>
                    {CurrentTool.icon}
                </button>
            )}
        </div>
    )
}
