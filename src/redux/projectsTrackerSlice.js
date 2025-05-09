import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { apiRequest } from "../api/request";

const initialState = {
  projects: [],
  projectBoard: {},
  toggleTab: 1,
  modalType: "",
  boardLoader: false,
  columnName: "",
  columnId: 0,
  columnPriority: 0,
};

export const setProjectBoardFetch = createAsyncThunk("userInfo", (id) =>
  apiRequest(`/project/get-project?project_id=${id}&expand=columns,mark`),
);

export const projectsTrackerSlice = createSlice({
  name: "projectsTracker",
  initialState,
  reducers: {
    setAllProjects: (state, action) => {
      state.projects = action.payload;
    },
    setProject: (state, action) => {
      state.projects.push(action.payload);
    },
    setToggleTab: (state, action) => {
      state.toggleTab = action.payload;
    },
    deleteProject: (state, action) => {
      state.projects.forEach((project) => {
        if (project.id === action.payload.id) {
          project.status = 10;
        }
      });
    },
    deletePersonOnProject: (state, action) => {
      state.projectBoard.projectUsers = state.projectBoard.projectUsers.filter(
        (person) => person.user_id !== action.payload,
      );
    },
    deleteTagProject: (state, action) => {
      state.projectBoard.mark = state.projectBoard.mark.filter(
        (tag) => tag.id !== action.payload,
      );
    },
    addPersonToProject: (state, action) => {
      state.projectBoard.projectUsers.push(action.payload);
    },
    addNewTagToProject: (state, action) => {
      state.projectBoard.mark.push(action.payload);
    },
    activeLoader: (state) => {
      state.boardLoader = true;
    },
    moveProjectTask: (state, action) => {
      state.projectBoard.columns.forEach((column, index) => {
        if (column.id === action.payload.columnId) {
          column.tasks.push({
            ...action.payload.startWrapperIndex.task,
            column_id: column.id,
          });
          apiRequest(`/task/update-task`, {
            method: "PUT",
            data: {
              task_id: action.payload.startWrapperIndex.task.id,
              column_id: column.id,
              execution_priority: column.tasks.length - 1,
            },
          }).then(() => {});
        }
        if (column.id === action.payload.startWrapperIndex.index) {
          state.projectBoard.columns[index].tasks = column.tasks.filter(
            (task) => task.id !== action.payload.startWrapperIndex.task.id,
          );
        }
      });
    },
    movePositionProjectTask: (state, action) => {
      state.projectBoard.columns.forEach((column, index) => {
        if (column.id === action.payload.startTask.column_id) {
          state.projectBoard.columns[index].tasks = column.tasks.filter(
            (task) => task.id !== action.payload.startTask.id,
          );
        }
        if (column.id === action.payload.finishTask.column_id) {
          column.tasks.splice(action.payload.finishIndex, 0, {
            ...action.payload.startTask,
            column_id: column.id,
          });
          apiRequest(`/task/update-task`, {
            method: "PUT",
            data: {
              task_id: action.payload.startTask.id,
              column_id: column.id,
            },
          }).then(() => {});
          const priorityTasks = [];
          column.tasks.forEach((task, index) => {
            const curTask = {
              task_id: task.id,
              execution_priority: index,
            };
            priorityTasks.push(curTask);
          });
          apiRequest(`/task/set-priority`, {
            method: "POST",
            data: {
              data: JSON.stringify(priorityTasks),
              column_id: column.id,
            },
          }).then(() => {});
        }
      });
    },
    filterCreatedByMe: (state, action) => {
      state.projectBoard.columns.forEach((column) => {
        column.tasks = column.tasks.filter(
          (task) => task.user_id === action.payload,
        );
      });
    },
    filteredParticipateTasks: (state, action) => {
      state.projectBoard.columns.forEach((column) => {
        column.tasks = column.tasks.filter((task) =>
          task.taskUsers.some((person) => person.user_id === action.payload),
        );
      });
    },
    filteredExecutorTasks: (state, action) => {
      state.projectBoard.columns.forEach((column) => {
        column.tasks = column.tasks.filter(
          (task) => task.executor_id === action.payload,
        );
      });
    },
    setColumnName: (state, action) => {
      state.columnName = action.payload;
    },
    setColumnId: (state, action) => {
      state.columnId = action.payload;
    },
    setColumnPriority: (state, action) => {
      state.columnPriority = action.payload;
    },
    editProjectName: (state, action) => {
      state.projects.forEach((project) => {
        if (project.id === action.payload.id) {
          project.name = action.payload.name;
        }
      });
    },
    editColumnName: (state, action) => {
      state.projectBoard.columns.forEach((column) => {
        if (column.id === action.payload.id) {
          column.title = action.payload.title;
        }
      });
    },
    modalToggle: (state, action) => {
      state.modalType = action.payload;
    },
  },
  extraReducers: {
    [setProjectBoardFetch.fulfilled]: (state, action) => {
      state.projectBoard = action.payload.project;
      state.boardLoader = false;
    },
  },
});

export const {
  setProject,
  setColumnName,
  deleteProject,
  setAllProjects,
  moveProjectTask,
  setToggleTab,
  modalToggle,
  activeLoader,
  editProjectName,
  editColumnName,
  setColumnId,
  setColumnPriority,
  deletePersonOnProject,
  deleteTagProject,
  addPersonToProject,
  addNewTagToProject,
  filterCreatedByMe,
  filteredParticipateTasks,
  filteredExecutorTasks,
  movePositionProjectTask,
} = projectsTrackerSlice.actions;

export const getProjects = (state) => state.tracker.projects;
export const getProjectBoard = (state) => state.tracker.projectBoard;
export const getToggleTab = (state) => state.tracker.toggleTab;
export const getValueModalType = (state) => state.tracker.modalType;
export const getBoarderLoader = (state) => state.tracker.boardLoader;
export const getColumnName = (state) => state.tracker.columnName;
export const getColumnId = (state) => state.tracker.columnId;
export const getColumnPriority = (state) => state.tracker.columnPriority;

export default projectsTrackerSlice.reducer;
