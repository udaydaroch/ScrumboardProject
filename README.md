# Scrumboard Management System

This project is a full stack Scrumboard Management System accessible through a Vercel-provided link.

## Project Overview

The Scrumboard Management System allows teams to manage their tasks efficiently. It includes both user and admin functionalities, enabling task management and team collaboration.

### Default Users

Below is the table of default users with their respective email addresses and passwords:

| Email                | Password    |
|----------------------|-------------|
| user1@example.com    | password1   |
| user2@example.com    | password2   |
| user3@example.com    | password3   |
| user4@example.com    | password4   |
| admin@example.com    | admin123    |

### Features

- **Admin Capabilities**:
  - Set up boards on particular days.
  - Add new scrumboards to different teams.
  - Confirm tasks when they are marked as done.

- **User Capabilities**:
  - Move tasks between columns, with progress saved automatically.
  - Assign themselves or other team members to tasks.
  - Any member of the same team can assign or unassign anyone from tasks.

- **Planned Features**:
  - Allow only assigned users to mark subtasks as completed, one at a time.
  - Allow only the admin to confirm tasks when they are put in the "Done" column.

## Technologies Used

### Frontend

- **React**: A JavaScript library for building user interfaces.
- **react-dnd**: A set of React utilities to help you build complex drag-and-drop interfaces.
- **MUI (Material-UI)**: A popular React UI framework for implementing Google's Material Design.
- **zustand**: A small, fast state-management solution for React.
- **React Context API**: For managing global state.
- **sessionStorage**: For storing user sessions.
- **Axios**: For making HTTP requests.

### Backend

- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express**: A web application framework for Node.js.
- **CORS**: Configuration for Cross-Origin Resource Sharing to handle requests between frontend and backend.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However, we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
