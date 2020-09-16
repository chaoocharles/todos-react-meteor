import React, { useState } from "react";
import { Task } from "./Task.jsx";
import { Tasks } from "/imports/api/tasks";
import { useTracker } from "meteor/react-meteor-data";
import TaskForm from "./TaskForm.jsx";
import _ from "lodash";
import { LoginForm } from "./LoginForm";

export const App = () => {
  const filter = {};

  const [hideCompleted, setHideCompleted] = useState(false);

  if (hideCompleted) {
    _.set(filter, "isChecked", false);
  }

  const { tasks, incompleteTasksCount, user } = useTracker(() => {
    Meteor.subscribe("tasks");

    return {
      tasks: Tasks.find(filter, { sort: { createdAt: -1 } }).fetch(),
      incompleteTasksCount: Tasks.find({ isChecked: { $ne: true } }).count(),
      user: Meteor.user(),
    };
  });

  const toggleChecked = ({ _id, isChecked }) => {
    Meteor.call("tasks.setChecked", _id, !isChecked);
  };

  const togglePrivate = ({ _id, isPrivate }) => {
    Meteor.call("tasks.setPrivate", _id, !isPrivate);
  };

  const handleDelete = ({ _id }) => {
    Meteor.call("tasks.remove", _id);
  };

  if (!user) {
    return (
      <div className="simple-todos-react">
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="simple-todos-react">
      <TaskForm user={user} />
      <h1>Todo List ({incompleteTasksCount})</h1>
      <div className="filters">
        <label>
          <input
            type="checkbox"
            readOnly
            checked={Boolean(hideCompleted)}
            onClick={() => setHideCompleted(!hideCompleted)}
          />
          Hide Completed
        </label>
      </div>
      <ul className="tasks">
        {tasks.map((task) => (
          <Task
            key={task._id}
            task={task}
            onCheckboxClick={toggleChecked}
            onDeleteClick={handleDelete}
            onTogglePrivateClick={togglePrivate}
          />
        ))}
      </ul>
    </div>
  );
};
