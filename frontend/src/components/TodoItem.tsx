import axios from "axios";
import React, { useState } from "react";

type Item = {
  id: number;
  taskName: string;
  comment: string;
  checked: boolean;
  date: string;
};

type TodoItemProps = {
  item: Item;
};

const TodoItem: React.FC<TodoItemProps> = ({ item: { id, taskName, comment, date, checked } }) => {
  const [done, setDone] = useState(checked);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    UpdateItem();
  };

  const UpdateItem = async () => {
    const res = await axios.get(`http://127.0.0.1:5000/updatetodoCard/${id}`);
    console.log(res.data);
    setDone(res.data.checked);
  };

  const RemoveItem = async () => {
    const res = await axios.delete(`http://127.0.0.1:5000/removetodoCard/${id}`);
  };

  return (
    <div className='grid grid-cols-[auto_1fr_1.5fr_auto] gap-6 py-2 px-6 bg-blue-500 rounded-xl items-center'>
      <input
        type='checkbox'
        className='w-8 h-8 inline-block'
        onChange={handleChange}
        checked={done}
      />
      <h2 className='text-2xl font-bold'>{taskName}</h2>
      <span className='grid'>
        <h3 className='text-xl'>{comment}</h3>
        <p>
          {new Date(date).toLocaleDateString("en-in", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </span>
      <button className='text-red-500 text-3xl font-bold' onClick={RemoveItem}>
        &times;
      </button>
    </div>
  );
};
export default TodoItem;
