import axios from "axios";
import { useEffect, useRef, useState } from "react";
import TodoItem from "./TodoItem";

type Item = {
  id: number;
  taskName: string;
  comment: string;
  checked: boolean;
  date: string;
};

const TodoList = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [item, setItem] = useState<{ taskName: string; comment: string; date: string }>(() => ({
    taskName: "",
    comment: "",
    date: "",
  }));
  const modal = useRef<HTMLDialogElement>(null);

  const GetItems = async () => {
    const res = await axios.get("http://127.0.0.1:5000/getAllTodoCards");
    setItems(res.data);
  };

  useEffect(() => {
    GetItems();
  });

  const openModal = () => {
    modal.current?.showModal();
    modal.current?.classList.add("grid");
  };
  const closeModal = () => {
    modal.current?.close();
    modal.current?.classList.remove("grid");
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    setItem(item => ({ ...item, [e.target.name]: e.target.value }));
  };

  const AddItem = async () => {
    closeModal();
    const res = await axios.post("http://127.0.0.1:5000/addTodoCard", { ...item, checked: false });
    if (res.status == 200) setItem({ taskName: "", comment: "", date: "" });
  };

  return (
    <div className='bg-slate-800 p-4 rounded-xl min-w-[40vw] grid gap-4'>
      <button
        className='p-2 text-2xl font-bold bg-blue-500 hover:bg-blue-700 active:bg-blue-600 rounded-xl'
        onClick={openModal}>
        Add Task
      </button>

      <div className='grid gap-4 p-4 max-h-[40vh] overflow-auto rounded-xl border-blue-400 border-2'>
        {items.length ? (
          items.map(item => <TodoItem item={item} key={item.id} />)
        ) : (
          <span className='px-4 text-lg'>No task here...</span>
        )}
      </div>

      <dialog ref={modal} className='new-item-dialog gap-4 p-4 bg-slate-900 rounded-xl'>
        <h2 className='text-4xl font-bold'>New Task:</h2>
        <form className='grid grid-rows-4 grid-cols-[auto_1fr] gap-x-4 gap-y-2 items-center text-lg'>
          <label htmlFor='taskname' className='font-bold'>
            Task:
          </label>
          <input
            type='text'
            id='taskName'
            name='taskName'
            onChange={handleChange}
            value={item.taskName}
            className='p-2'
            required
          />
          <label htmlFor='comment' className='font-bold'>
            Comment:
          </label>
          <input
            type='text'
            id='comment'
            name='comment'
            onChange={handleChange}
            value={item.comment}
            className='p-2'
            required
          />
          <label htmlFor='date' className='font-bold'>
            Date:
          </label>
          <input
            type='date'
            id='date'
            name='date'
            onChange={handleChange}
            value={item.date}
            className='p-2'
            required
          />
          <div className='grid col-[1/-1] grid-cols-2 gap-4'>
            <input
              type='button'
              onClick={closeModal}
              value='Cancel'
              className='bg-blue-600 rounded-md'
            />
            <input type='button' onClick={AddItem} value='Add' className='bg-blue-600 rounded-md' />
          </div>
        </form>
      </dialog>
    </div>
  );
};
export default TodoList;
