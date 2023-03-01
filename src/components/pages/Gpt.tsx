import axios, { AxiosResponse } from "axios";
import React, { FC, useContext, useState } from "react";
import { ModalContext } from "../../App";
import Header from "../common/Header";

// Interfaces
interface Post {
  Error: any;
  box: string;
  img: string;
  length: number;
  i: number;
  [index: number]: any;

  result: string;
}

interface P {
  memoId: string;
}

// React Start from here
const GptMain: FC<P> = (props: P): JSX.Element => {
  //--------------------------------------------------------
  // Declaration of useState, useContext, useRef ...
  const [techInput, setTechInput] = useState("");
  const [answerInput, setAnswerInput] = useState("");
  const { setModalContent } = useContext(ModalContext);
  const [viewQuestion, setViewQuestion] = useState("");
  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  //--------------------------------------------------------
  // Event Handler

  // onSubmitQuestion Event
  async function onSubmitQuestion(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    generateQuestion();
  }

  // onSubmitAnswer Event
  async function onSubmitAnswer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    generateAnswer();
  }

  //--------------------------------------------------------
  // Axios Request

  const generateQuestion = async () => {
    try {
      await axios
        .post<Post>(process.env.REACT_APP_API_URL + "/api/gpt/question", {
          techStack: techInput,
        })
        .then((res) => {
          let gptText = res.data.result;
          let NormGptText = gptText.replace(/\n/g, "");
          setViewQuestion(NormGptText);
        });
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error(
          (error.response as AxiosResponse<{ message: string }>)?.data.message
        );
      } else {
        console.error(error);
      }
      if (error.response.data.message) {
        setModalContent({
          header: "Edit ERROR",
          message: error.response.data.message,
          toggle: "view",
        });
      }
    }
  };

  const generateAnswer = async () => {
    try {
      await axios
        .post<Post>(process.env.REACT_APP_API_URL + "/api/gpt/answer", {
          question: viewQuestion,
          answer: answerInput,
        })
        .then((res) => {
          let gptText = res.data.result;
          let NormGptText = gptText.replace(/\n/g, "");
          setViewQuestion(NormGptText);
        });
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error(
          (error.response as AxiosResponse<{ message: string }>)?.data.message
        );
      } else {
        console.error(error);
      }
      if (error.response.data.message) {
        setModalContent({
          header: "Edit ERROR",
          message: error.response.data.message,
          toggle: "view",
        });
      }
    }
  };
  //--------------------------------------------------------
  /* Fetching Data */

  //--------------------------------------------------------
  // return

  return (
    <>
      {/* Header */}
      <Header header="GPT" search={false} />
      {/* Main */}
      <div>
        <main className="gpt_main">
          <h3>Tech Interview</h3>
          <form onSubmit={onSubmitQuestion}>
            <input
              type="text"
              name="question"
              placeholder="Enter your tech stack"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
            />
            <input type="submit" value="Generate" />
          </form>
          <div>
            <form className="edit-form gpt-form" onSubmit={onSubmitAnswer}>
              <textarea
                className="form-control form-control-gpt"
                placeholder={viewQuestion}
                aria-label="Disabled input example"
                disabled
              ></textarea>
              <textarea
                className="form-control"
                id="Text"
                placeholder="Write your answer here"
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
              ></textarea>
              <button type="submit" className="login-button mt-2 mb-4">
                Check my answer
              </button>
            </form>
          </div>
        </main>
      </div>
    </>
  );
};

export default GptMain;
