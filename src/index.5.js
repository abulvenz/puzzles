import m from 'mithril';

class Todo {
    constructor({ description = "Learn mithril", completed = false, edits = null, id = 0 }) {
        this.description = description;
        this.completed = completed;
        this.edits = edits;
        this.id = id;
    }
    setCompleted(val) {
        this.completed = val;
        console.log('complete', this.completed, val)
        store(todoList);
    }
    getCompleted() {
        return this.completed;
    }
}

class TodoList {
    constructor(todos = []) {
        this.todos = todos.map(t => new Todo(t));
    }
    addTodo(todo) {
        this.todos.push(todo);
        store(this);
    }
    getTodos() {
        return this.todos;
    }
    removeTodo(todo) {
        this.todos = this.todos.filter(t => t.description !== todo.description);
        store(this);
    }
}

var loadOrCreate = () => {
    try {
        let result = localStorage.getItem('todos');
        return new TodoList(JSON.parse(result) || []);
    } catch (error) {
        return new TodoList([]);
    }
};

var store = (todoList) => {
    localStorage.setItem('todos', JSON.stringify(todoList.getTodos()));
}

var todoList = loadOrCreate();

console.log('todos', todoList);

class TodoItemView {
    view(vnode) {
        return [
            m(".input-group",
                [
                    m("span.input-group-addon",
                        m("input[aria-label='...'][type='checkbox']", {
                            checked: vnode.attrs.todo.getCompleted(),
                            onchange: ev => { console.log(ev); vnode.attrs.todo.setCompleted(ev.target.checked) }
                        })
                    ),
                    m("input.form-control[aria-label='...'][type='text']", { value: vnode.attrs.todo.description }),
                    m(".input-group-btn",
                        [
                            m("button.btn.btn-default[aria-label='Help'][type='button']",{
                                onclick: ev=>todoList.removeTodo(vnode.attrs.todo)
                            },
                                m("span.glyphicon.glyphicon-remove")
                            ),
                        ]
                    )
                ]
            )
        ];
    }
}

class TodoListView {
    addTodo() {
    }
    view(vnode) {
        return [
            m(".input-group",
                [
                    m("input.form-control[placeholder='Search for...'][type='text']", {
                        onchange: (ev) => {
                            this.description = ev.target.value;
                        }
                    }),
                    m("span.input-group-btn",
                        m("button.btn.btn-default[type='button']", {
                            onclick: (ev) => {
                                vnode.attrs.todoList.addTodo(new Todo({ description: this.description }));
                            }
                        },
                            "+"
                        )
                    )
                ]
            ),
            m('.list-group',
                vnode.attrs.todoList.getTodos().map(todo =>
                    m(TodoItemView, { todo: todo })
                )
            )
        ];
    }
}

export default class TodoApp {
    view(vnode) {
        return m('.container', [
            m('h1', 'todos'),
            m(TodoListView, { todoList })
        ]);
    }
}