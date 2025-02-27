import { observer } from "mobx-react-lite"
import { applySnapshot, getSnapshot, types } from "mobx-state-tree"
import "./App.css"
import { useLocalStorage } from "./useLocalStorage"
import { useEffect } from "react"
import { reaction } from "mobx"

const Todo = types
  .model({
    name: types.optional(types.string, ""),
    done: types.optional(types.boolean, false),
  })
  .actions((self) => ({
    setName(newName: string) {
      self.name = newName
    },
    toggle() {
      self.done = !self.done
    },
  }))

const User = types.model({
  name: types.optional(types.string, ""),
})

const RootStore = types
  .model({
    users: types.map(User),
    todos: types.optional(types.map(Todo), {}),
  })
  .actions((self) => ({
    addTodo(id: number, name: string) {
      self.todos.set(id, Todo.create({ name }))
    },
  }))

const store = RootStore.create({
  users: {},
})

store.addTodo(1, "Write documentation")
store.addTodo(2, "Hydrate")
store.addTodo(3, "Praise Kier")
/* store.todos.get(1)?.toggle()
store.todos.get(2)?.toggle() */

const App = observer(() => {
  const [storedTodos, setStoredTodos] = useLocalStorage("todos", getSnapshot(store.todos))

  useEffect(() => {
    applySnapshot(store.todos, storedTodos)
  }, [storedTodos])

  useEffect(() => {
    const disposer = reaction(
      () => getSnapshot(store.todos),
      (snapshot) => {
        setStoredTodos(snapshot)
      }
    )
    return () => disposer()
  }, [setStoredTodos])
  return (
    <>
      <h1>ToDo App</h1>
      <ul>
        {Array.from(store.todos.values()).map((todo, index) => (
          <li key={index}>
            <button onClick={() => todo.toggle()}>{todo.done ? "Done" : "Not Done"}</button>
            {todo.name}
          </li>
        ))}
      </ul>
    </>
  )
})

export default App
