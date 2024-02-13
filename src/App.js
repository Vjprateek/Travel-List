import { useState } from "react";

export default function App(newItem) {
  const [items, setItems] = useState([]);

  function handleItem(newItem) {
    setItems((items) => [...items, newItem]);
  }
  function clearItem(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }
  function onToggleItem(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }
  function deleteList() {
    const confirmed = window.confirm("Are you sure about clearing the list?");
    if (confirmed) setItems([]);
  }
  return (
    <div className="app">
      <Logo />
      <Form handleItem={handleItem} />
      <PackingList
        items={items}
        clearItem={clearItem}
        onToggleItem={onToggleItem}
        deleteList={deleteList}
      />
      <Stats items={items} />
    </div>
  );
}

function Logo() {
  return <h1>🌴 FAR AWAY💼</h1>;
}
function Form({ handleItem }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  function onAddItem(e) {
    e.preventDefault();
    if (!description) return;
    const newItem = { description, quantity, packed: false, id: Date.now() };
    handleItem(newItem);
    setDescription("");
    setQuantity(1);
  }
  return (
    <form className="add-form" onSubmit={onAddItem}>
      <h3>What do you need for your😍 trip</h3>
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></input>
      <button>ADD</button>
    </form>
  );
}

function PackingList({ items, clearItem, onToggleItem, deleteList }) {
  const [sortBy, setSortBy] = useState("inputOrder");
  let sortedItems;
  if (sortBy === "inputOrder") sortedItems = items;
  if (sortBy === "description")
    sortedItems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));

  if (sortBy === "packedStatus")
    sortedItems = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));

  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item
            item={item}
            clearItem={clearItem}
            onToggleItem={onToggleItem}
            key={item.id}
          />
        ))}
      </ul>

      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="inputOrder">SORT BY INPUT ORDER</option>
          <option value="description">SORT BY DESCRIPTION</option>
          <option value="packedStatus">SORT BY PACKED STATUS</option>
        </select>
        <button onClick={deleteList}>CLEAR LIST</button>
      </div>
    </div>
  );
}
function Item({ item, clearItem, onToggleItem }) {
  return (
    <li>
      <input
        type="checkbox"
        value={item.packed}
        onChange={() => onToggleItem(item.id)}
      ></input>
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => clearItem(item.id)}>❌</button>
    </li>
  );
}
function Stats({ items }) {
  if (!items.length) return <p className="stats">You are ready to go</p>;
  const numPacked = items.filter((item) => item.packed);
  const percentage = Math.round((numPacked.length / items.length) * 100);
  return (
    <div className="stats">
      {percentage === 100
        ? "You have all packed"
        : `You have packed ${numPacked.length} items out of ${items.length}(
      ${percentage}%)`}
    </div>
  );
}
