- loggedInUser validation for all pages [to be done] specially for ManageUsers and AddUser
- login/register fields validation
- move Toaster to App.jsx
- Add a loading spinner for all pages
- add loading toast when adding a new user by senior assistant

- trim the values when submitting any form, add validations also
- learn more about lazy loaders
- change the delete icon in manage users to text like activate/deactivate, which will be used in the future to activate/deactivate users
- file upload backend is done, try fetching for that
- toggle user status backend is done, try fetching for that
- get all the users backend is done (for admin only), try fetching for that
- tick marks the done tasks

### Neeraj-

- fetch the documents list from backend file/get-documents????
- /file/get-documents with query params like
  /file/get-documents?status=pending&department=education

- /file/download-pdf/:filename for downloading file directly

### 26/01/2025

- fetch departments from server, (for dropdown menu of upload file)
  `/department/get-departments`
- upload window should disappear after uploading document
- document list on frontend should refresh after document upload
- fetch the document list based on current tab `(pending, approved, rejected, correction)`, all types of documents are mixed up
- there is rapidly console logs because of state change, find that out (printing `loggedInUser` in console)
- remove the dark toast messages
- after login toast is shown two times, fix that to only show once
