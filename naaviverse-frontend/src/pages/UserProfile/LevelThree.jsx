import React, { useEffect, useState } from "react";
import close from "../../images/close.svg";
import axios from "axios";
import styles from "./level3.module.scss"

const LevelThree = ({
  profileData,
  createLevelThree,
  setCreateLevelThree,
  handleProfileData,
}) => {
  const [loading, setLoading] = useState(false);
  const [loadingSaveAnswer, setLoadingSaveAnswer] = useState(false);
  const [allQuestions, setAllQuestions] = useState([]);
  const [questionNo, setQuestionNo] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [allAnsweredQuestions, setAllAnsweredQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [totalAnswered, setTotalAnswered] = useState(0)
  const answrOptions = [
    "Dislike",
    "Slightly Dislike",
    "Neutral",
    "Slightly Enjoy",
    "Enjoy",
  ];
  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://careers.marketsverse.com/question/get`)
      .then(({ data }) => {
        const initialData = data.data;
        const sorted = initialData
          .slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setAllQuestions(sorted);
        console.log(sorted, "lkwehflwekhfwef")
        setLoading(false);
      });
      getAllAnswers()
  }, []);

  const getAllAnswers = () => {
    axios
    .get(
      `https://careers.marketsverse.com/userAnswers/get?userId=${profileData?._id}`
    )
    .then(({ data }) => {
      console.log(data, "kjeflwkjheflkwhflwkhef")
      // if (data.status && data.total < 48) {
        setTotalAnswered(data.total)
        setAllAnsweredQuestions(data.data);
        if(data.total === 48){
          addPersonality()
        }
      // }
    });
  }

  // useEffect(() => {
  //   if (allQuestions.length > 0) {
  //     checkQuestionStatus(allQuestions[questionNo].question);
  //   }
  // }, [questionNo, allQuestions]);

  const addPersonality = () => {
    axios
      .put(`https://careers.marketsverse.com/users/addPersonality`, {
        userId: profileData?._id,
      })
      .then(({ data }) => {
        if (data.status) {
          handleProfileData();
          setCreateLevelThree(false);
        }
      });
  };

  const saveAnswer = (question, answerId) => {
    setLoadingSaveAnswer(true);
    axios
      .post(`https://careers.marketsverse.com/userAnswers/add`, {
        userId: profileData?._id,
        question: question.question,
        relatedTo: question.relatedTo,
        answer: answrOptions[answerId],
      })
      .then(({ data }) => {
        if (data.status) {
          getAllAnswers()

          // if (questionNo !== 47) {
          //   setQuestionNo(questionNo + 1);
          //   setLoadingSaveAnswer(false);
          // } else {
          //   addPersonality();
          // }
        }
      });
  };

  const nextQuestion = () => {
    console.log(answered, "lkwehlwkehflw");

    if (!answered && selectedAnswer) {
      saveAnswer();
    } else {
      setQuestionNo(questionNo + 1);
    }
    //   setQuestionNo(questionNo + 1);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(allQuestions.length / itemsPerPage);

  const paginatedQuestions = allQuestions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const paginatedQuestionsWithAnswers = paginatedQuestions.map((item, index) => {
    const matchedAnswer = allAnsweredQuestions?.find(answer => answer?.question === item?.question);
    const answered = !!matchedAnswer; // Check if question is answered
    const selectedAnswerIndex = answered ? answrOptions.indexOf(matchedAnswer.answer) : -1; // Get index of selected answer
  
    return {
      ...item,
      answered,
      selectedAnswerIndex
    };
  });
  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => prevPage - 1);
  };

  return (
    <>
      <div className="popularS1">
        {/* {levelTwoStep === 7 && (
          <div className="successMsg">
            You Have Successfully Created Your Naavi Profile Level 2.
          </div>
        )} */}
        <div
          className="head-txt"
          style={{
            height: "4rem",
            // display: levelTwoStep === 7 ? "none" : "",
          }}
        >
          <div>Naavi Profile Level Three</div>
          <div
            onClick={() => {
              setCreateLevelThree(false);
              //   setLevelTwoFields({
              //     financialSituation: "",
              //     school: "",
              //     performance: "",
              //     curriculum: "",
              //     stream: "",
              //     grade: "",
              //     linkedin: "",
              //   });
            }}
            className="close-div"
          >
            <img src={close} alt="" />
          </div>
        </div>
        <div
          className="overall-div"
          style={{
            height: "calc(100% - 4rem)",
            // display: levelThreeStep === 7 ? "none" : "",
          }}
        >
          {/* <>
            <div
              style={{
                marginBottom: "2rem",
                fontSize: "1rem",
                marginTop: "2rem",
              }}
            >
              {allQuestions[questionNo]?.question}
            </div>
            <div className="btnss-div">
              {!loading &&
                answrOptions.map((item) => (
                  <div
                    className={
                      item === selectedAnswer
                        ? "eachh-btnn-selected"
                        : "eachh-btnn"
                    }
                    onClick={() => {
                      setSelectedAnswer(item);
                    }}
                  >
                    {item}
                  </div>
                ))}
            </div>
            <div className="stepBtns1">
              <p style={{ textAlign: "center" }}>{`${questionNo + 1} / 48`}</p>
              <div
                onClick={(e) => {
                  if (questionNo !== 0) {
                    setQuestionNo(questionNo - 1);
                  }
                }}
                style={{
                  background: "#1F304F",
                  width: "100%",
                  height: "3.5rem",
                  opacity: questionNo === 0 ? "0.5" : 1,
                  //   cursor: "not-allowed",
                }}
              >
                Go Back
              </div>
              <div
                style={{
                  height: "3.5rem",
                  background: "#59A2DD",
                  width: "100%",
                  //   cursor: levelTwoFields?.financialSituation
                  //     ? "pointer"
                  //     : "not-allowed",
                  opacity: selectedAnswer ? "1" : "0.5",
                }}
                onClick={() => {
                  if (!loadingSaveAnswer && selectedAnswer) {
                    nextQuestion();
                  }
                }}
              >
                {loadingSaveAnswer ? "Saving Answer.." : "Next Question"}
              </div>
            </div>
          </> */}
          <>
          {/* {allQuestions?.map(item => {
            <div>
              <div>
                {item?.question}
              </div>
              <div>
                {Array(5).map((item, index) => (
                  <div className="circleOption">
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>
          })} */}
          <div className={styles.progressText}>Test Progress: {totalAnswered} / 48</div>
          <div className={styles.level3Section}>
            <div className={styles.allAnswersWrapper}>
              {answrOptions?.map((item, index) => (
                <div>
                  {index + 1}: {item}
                </div>
              ))}
            </div>
            {paginatedQuestionsWithAnswers.map((item, index) => (
              <div key={index} className={styles.singleQuestionWrapper}>
                <div>{item?.question}</div>
                <div style={{ display: "flex", gap: "20px" }}>
                  {Array(5).fill("").map((item1, index) => (
                    <div key={index} className={item.answered && index === item.selectedAnswerIndex ? styles.answerCircleSelected : styles.answerCircle} onClick={e => saveAnswer(item, index)}>
                      {index + 1}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className={styles.buttons}>
              <button onClick={currentPage>1 ? handlePrevPage: null} style={{opacity: currentPage>1?1:0.5}}>Previous</button>
              <button onClick={currentPage < totalPages ? handleNextPage: null} style={{opacity: currentPage < totalPages?1:0.5}}>Next</button>
            </div>
          </div>
          </>

          {/* 
          {levelTwoLoading && (
            <div
              className="loading-component"
              style={{
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                position: "absolute",
                display: "flex",
              }}
            >
              <LoadingAnimation1 icon={lg1} width={200} />
            </div>
          )}  */}
        </div>
      </div>
    </>
  );
};

export default LevelThree;
