import logo from "./logo.svg";
import "./App.css";
import SamplePage from "./Pages/SamplePage";

function App() {
  var item_value = sessionStorage.setItem(
    "access_token",
    "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJIR3NsZ2VLTG16WnAxbXpfamc3c0R4T0QydDFEVDVDQkZhTVVnMS1kSzJzIn0.eyJleHAiOjE3MzMzMjIyNzQsImlhdCI6MTcwMTc4NjI3NCwianRpIjoiYzUxMWE5ZDYtZTc2ZC00NTg0LWE1NmEtNmI0YWFmYTEzOTEzIiwiaXNzIjoiaHR0cHM6Ly90dG1zbG9naW4uYWxwaGF3YXJlLmlvL3JlYWxtcy9yZWFsbWV0ZXN0Iiwic3ViIjoiNjM5Yjg5MjctYzZhYS00YmEyLTgzZDctNjczOTI1YjI5NTU3IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoibWljcm9zZXJ2aWNlLWF1dGgiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbIi8qIl0sInNjb3BlIjoiZW1haWwgcHJvZmlsZSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiY2xpZW50SG9zdCI6IjExMC4yMjcuMjQ5LjIzOCIsInByZWZlcnJlZF91c2VybmFtZSI6InNlcnZpY2UtYWNjb3VudC1taWNyb3NlcnZpY2UtYXV0aCIsImNsaWVudEFkZHJlc3MiOiIxMTAuMjI3LjI0OS4yMzgiLCJjbGllbnRfaWQiOiJtaWNyb3NlcnZpY2UtYXV0aCJ9.RVTATILl87B7cyMiSungYdOFhI7K6_gpBoXLQQSCjh3ODO2pP_L-orDlIccZ7f8MxOehal2i0Y8fhq2R7CdzsXGHO2nOTXhLu7llZEVPUZJZHX6SinCZvhlrajmROO1J4UGqcCk8bIvf-mR8aYqsOdVNPM33pHFfyqPMUkkSSKQ7JJm1kZcnOvCxorsz2Y6HIW5zEgORJ7tlKgi1wXub84wMdwHrTFUDM75QroHT9Jnyesjf_H5ZMrMX1IAuYTC3_2SqLlBvm77YcfmgGa3VjKjlDrctM-vtlJeBt6xpVtafNiKZfG6cRU-uG-alVHbtIo1vopvmJ3WHaxx6dM3aCQ"
  );
  return (
    <div className="App">
      <SamplePage />
    </div>
  );
}

export default App;
