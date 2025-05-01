import { FormEvent, useState} from 'react'



interface task{
    taskId: number
    task: string
    state: 'done' | 'in progress'
}



export default function Todos(){
    const [tasks, setTasks] = useState<task[]>([])
    const [newTask, setNewTask] = useState<string>('')

    function handleSubmitTask(e: FormEvent){
        e.preventDefault();
        console.log(newTask);
        const newTaskItem: task = {
            taskId: tasks.length + 1,
            task: newTask,
            state: 'in progress'
        };
        setTasks(prev => [...prev, newTaskItem]);
        
    }

    function toggleTaskStatus(taskId: number, checked: boolean) {
        setTasks(prev => prev.map(task =>
            task.taskId === taskId
                ? { ...task, state: checked ? 'done' : 'in progress' }
                : task
        ))
    }

    return(
        <div className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                Esta es la administracion de lista de tareas de Felipao
            </h1>
            <div className="mb-6">
                <p className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Tareas:</p>
                <ul className="space-y-3">
                    {tasks.map(task => (
                        <li key={task.taskId} className="flex justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded">
                            <span className="text-gray-800 dark:text-gray-100">{task.task}</span>
                            <span className={`${task.state === 'done' ? 'text-green-600' : 'text-indigo-600'} text-sm`}>{task.state}</span>
                            <input
                                className={task.state === 'done' ? 'hidden' : ''}
                                type="checkbox"
                                checked={task.state === 'done'}
                                onChange={e => toggleTaskStatus(task.taskId, e.target.checked)}
                            />
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <p className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Agregar tareas:</p>
                <form onSubmit={handleSubmitTask} className="flex">
                    <input
                        type="text"
                        placeholder="Ingrese la nueva tarea"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-r hover:bg-indigo-700 transition">
                        Agregar
                    </button>
                </form>
            </div>
        </div>
    )
}