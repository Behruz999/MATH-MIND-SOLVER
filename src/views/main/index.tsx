import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { play } from '../../player/play';
import { CiSettings } from "react-icons/ci";
import { ChangeEvent } from 'react';
import { customProps, finishWorksProps, exampleProps, timeProps, summaryProps } from '../../aliases/alias';
import { generation, check } from '../../handlers/handler';

// Define the initial state outside the component
const initialState: customProps = {
  limitNumber: '',
  countExample: '',
  operation: 'addition',
};

const initialFinishWorks: finishWorksProps = {
  min: 0,
  sec: 0,
  userAnswers: [],
};

export const MainPage = () => {
  const [shadowPosition, setShadowPosition] = useState({ x: 0, y: 0 })
  const [shadowPosition1, setShadowPosition1] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [isHovered1, setIsHovered1] = useState(false)
  const [currentCase, setCurrentCase] = useState<string>('settings');
  const [time, setTime] = useState({ min: 0, sec: 0 });
  const [reset, setReset] = useState(false); // State to handle timer reset
  const [topbarPadding,] = useState(10); // Initial padding value
  const [scrollY, setScrollY] = useState(0); // State to track scroll position
  const [isReview, setIsReview] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [custom, setCustom] = useState<customProps>({
    limitNumber: '',
    countExample: '',
    operation: 'addition',
  })
  const [finishWorks, setFinishWorks] = useState<finishWorksProps>({
    min: 0,
    sec: 0,
    userAnswers: []
  });
  const storedData = localStorage.getItem('ex');
  const examples = storedData ? JSON.parse(storedData) : null;
  const summaries = JSON.parse(localStorage.getItem('summary') ?? '{}');

  // console.log(finishWorks);

  const { min, sec } = time;

  function generateExample() {
    play();
    if (custom.countExample == '' || custom.limitNumber == '' || custom.operation == '') {
      alert(
        'Please fill in all the fields'
      )
    } else {
      const generatedExamples = generation(Number(custom.limitNumber), Number(custom.countExample), custom.operation)
      localStorage.setItem('ex', JSON.stringify(generatedExamples))
      setCurrentCase('exams')
      // Reset the timer
      setTime({ min: 0, sec: 0 });
      setReset(!reset); // Toggle the reset state to restart the timer
      setCustom(initialState)
      setFinishWorks(initialFinishWorks)
    }

  }

  // input changes handle
  const changeHandler = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    setCustom({ ...custom, [e.target.name]: e.target.value });
  };

  const handleCustomInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id } = e.target;
    changeHandler(e);

    if (id === "any1") {
      document.querySelectorAll('input[type="radio"]').forEach((radio) => {
        const inputRadio = radio as HTMLInputElement;
        if (["100", "500", "1000"].includes(inputRadio.id)) {
          inputRadio.checked = false;
        }
      });
    } else if (id === "any2") {
      document.querySelectorAll('input[type="radio"]').forEach((radio) => {
        const inputRadio = radio as HTMLInputElement;
        if (["ten", "fifty", "hundred"].includes(inputRadio.id)) {
          inputRadio.checked = false;
        }
      });
    }
  };

  const handleRadioClick = (e: any) => {
    changeHandler(e);

    const clickedRadioId = e.target.id;
    if (["100", "500", "1000"].includes(clickedRadioId)) {
      const specifiedInput = document.getElementById("any1") as HTMLInputElement;;
      if (specifiedInput) {
        specifiedInput.value = "";
      }
    } else if (["ten", "fifty", "hundred"].includes(clickedRadioId)) {
      const specifiedInput = document.getElementById("any2") as HTMLInputElement;;
      if (specifiedInput) {
        specifiedInput.value = "";
      }
    }
  };

  const submit = (finishTime: timeProps) => {
    finishWorks.min = finishTime.min
    finishWorks.sec = finishTime.sec

    const updatedUserAnswers = finishWorks.userAnswers.map((item: exampleProps) => ({
      ...item,
      userAnswer: Number(item?.userAnswer)
    }));
    setFinishWorks(prevState => ({
      ...prevState,
      userAnswers: updatedUserAnswers
    }));

    const summaries = check(updatedUserAnswers, Number(finishWorks?.min), Number(finishWorks?.sec))

    setCurrentCase('summary')
    localStorage?.setItem('summary', JSON.stringify(summaries))
  }

  // Function to handle input change and update the userAnswer property of the example object
  const handleInputChange = (ex: exampleProps, newValue: string | number) => {
    setFinishWorks(prevFinishWorks => {
      // Clone the previous userAnswers array to avoid mutating state directly
      const updatedUserAnswers = [...prevFinishWorks.userAnswers];
      // Find the index of the example in userAnswers array
      const exampleIndex = updatedUserAnswers.findIndex(item => item.num1 === ex.num1 && item.num2 === ex.num2 && item.operation === ex.operation);
      // If example exists in userAnswers, update its userAnswer field; otherwise, push it to userAnswers array
      if (exampleIndex !== -1) {
        updatedUserAnswers[exampleIndex] = { ...updatedUserAnswers[exampleIndex], userAnswer: newValue };
      } else {
        updatedUserAnswers.push({ ...ex, userAnswer: newValue });
      }
      return { min: time.min, sec: time.sec, userAnswers: updatedUserAnswers };
    });
  };

  // Debounce function to delay execution of handleInputChange
  const debounce = (fn: Function, delay: number) => {
    let timerId: number;
    return function (...args: any[]) {
      if (timerId) clearTimeout(timerId);
      timerId = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };

  // navigating next page after some execution
  const next = async (t: timeProps) => {
    play();

    // Check if all user answers are provided and not empty
    const isAllResolved = finishWorks.userAnswers.every(
      (item: exampleProps) => item.userAnswer !== null && item.userAnswer !== undefined && item.userAnswer !== ''
    );

    if (finishWorks.userAnswers?.length !== examples?.length || !isAllResolved) {
      alert('All examples should be resolved!');
    } else {
      submit(t);
      // localStorage?.setItem('ex', JSON?.stringify(finishWorks.userAnswers));
    }
  };



  // Debounced version of handleInputChange with 500ms delay
  const debouncedHandleInputChange = debounce(handleInputChange, 500);

  // button animation styles
  const handleMouseMove = (e: any) => {
    setShadowPosition({ x: e.nativeEvent.offsetX - 100, y: e.nativeEvent.offsetY - 100 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleMouseMove1 = (e: any) => {
    setShadowPosition1({ x: e.nativeEvent.offsetX - 100, y: e.nativeEvent.offsetY - 100 });
  };

  const handleMouseEnter1 = () => {
    setIsHovered1(true);
  };

  const handleMouseLeave1 = () => {
    setIsHovered1(false);
  };


  const goHome = () => {
    play()
    localStorage.clear()
  }

  const restart = () => {
    play()
    localStorage.clear()
    setCurrentCase('settings')
    setRefreshKey(refreshKey + 1)
  }

  const getSummaryImageSrc = (percentCorrect: string) => {
    // Convert the percentCorrect string to a number for comparison
    const percentage = parseFloat(percentCorrect.replace('%', ''));

    switch (true) {
      case percentage > 50:
        return "/rag-doll-with-checklist-green-pencil-fotor-bg-remover-20240430201428.png";
      // Add more cases if needed
      default:
        return "/rag-doll-with-red-pencil-checklist-fotor-bg-remover-20240430201451.png";
    }
  };


  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => {
        const nextSec = prevTime.sec === 59 ? 0 : prevTime.sec + 1;
        const nextMin = prevTime.sec === 59 ? prevTime.min + 1 : prevTime.min;
        return { min: nextMin, sec: nextSec };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [reset]); // Re-run the effect whenever `reset` changes

  useEffect(() => {
    const handleScroll = () => {
      // Update scrollY state with the current scroll position
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // No dependencies, runs only once

  useEffect(() => {
  }, [refreshKey]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentCase]);

  return (
    <>
      {
        currentCase === 'settings' ?
          <div className="second_wrapper bg-white">
            <div className="container mx-auto py-5 px-2">
              <div className="second_header flex flex-col md:flex-row justify-center items-center mb-12 text-center md:text-left">
                <h1 className="second_header_txt text-3xl capitalize">customize examples settings</h1>
                <p className="settings_icon_place pl-0 md:pl-2 mt-2 md:mt-0">
                  <CiSettings size={25} className="settings_icon animate-spin animate-infinite animate-duration-[4000ms] hover:animate-none cursor-pointer max-md:hidden" />
                </p>
              </div>
              <div className="second_row flex flex-col lg:flex-row justify-between">
                <div className="kol6 flex justify-center w-full lg:w-1/2 mb-6 lg:mb-0">
                  <div className="limit_number w-full text-2xl px-4">
                    <h5 className="part_headers mb-5 capitalize text-2xl">limit number</h5>
                    <div className="limit_body flex flex-wrap items-baseline">
                      <div className="radios flex items-center mr-5 mb-2">
                        <input className="inp_radio" type="radio" onClick={e => handleRadioClick(e)} value="100" name="limitNumber" id="100" />
                        <label className="labels ml-2" htmlFor="100">0-100</label>
                      </div>
                      <div className="radios flex items-center mr-5 mb-2">
                        <input className="inp_radio" type="radio" onClick={e => handleRadioClick(e)} value="500" name="limitNumber" id="500" />
                        <label className="labels ml-2" htmlFor="500">0-500</label>
                      </div>
                      <div className="radios flex items-center mr-5 mb-2">
                        <input className="inp_radio" type="radio" onClick={e => handleRadioClick(e)} value="1000" name="limitNumber" id="1000" />
                        <label className="labels ml-2" htmlFor="1000">0-1000</label>
                      </div>
                      <span className="or mr-5 mb-2">or</span>
                      <input placeholder="custom limit" className="inp_radio max-md:mt-4 mb-2 max-md:w-full bg-white border border-gray-300 focus:border-blue-500 focus:outline-none p-2 rounded-lg" onChange={e => handleCustomInputChange(e)} type="number" name="limitNumber" id="any1" />
                    </div>
                  </div>
                </div>
                <div className="kol6 flex justify-center w-full lg:w-1/2">
                  <div className="limit_number w-full text-2xl px-4">
                    <h5 className="part_headers mb-5 capitalize text-2xl">count examples</h5>
                    <div className="limit_body flex flex-wrap items-baseline">
                      <div className="radios flex items-center mr-5 mb-2">
                        <input className="inp_radio" type="radio" onClick={e => handleRadioClick(e)} value="10" name="countExample" id="ten" />
                        <label className="labels ml-2" htmlFor="ten">10</label>
                      </div>
                      <div className="radios flex items-center mr-5 mb-2">
                        <input className="inp_radio" type="radio" onClick={e => handleRadioClick(e)} value="50" name="countExample" id="fifty" />
                        <label className="labels ml-2" htmlFor="fifty">50</label>
                      </div>
                      <div className="radios flex items-center mr-5 mb-2">
                        <input className="inp_radio" type="radio" onClick={e => handleRadioClick(e)} value="100" name="countExample" id="hundred" />
                        <label className="labels ml-2" htmlFor="hundred">100</label>
                      </div>
                      <span className="or mr-5 mb-2">or</span>
                      <input placeholder="custom count" className="inp_radio max-md:mt-4 mb-2 max-md:w-full bg-white border border-gray-300 focus:border-blue-500 focus:outline-none p-2 rounded-lg" onChange={e => handleCustomInputChange(e)} type="number" name="countExample" id="any2" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="operations py-12 px-4 lg:px-4 text-2xl">
                <h5 className="oper_label mb-5 capitalize">Operation</h5>
                <select className="selection w-full lg:w-1/3 p-2 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none" name="operation" id="operation" onChange={e => changeHandler(e)}>
                  <option value="addition">Addition ( + )</option>
                  <option value="subtraction">Subtraction ( - )</option>
                  <option value="multiplication">Multiplication ( x )</option>
                  <option value="division">Division ( : )</option>
                </select>
              </div>
              <div className="generate_place text-center">
                <button
                  className="start_btn bg-blue-500 text-white py-3 px-8 rounded-md relative overflow-hidden hover:bg-blue-600 transition-all duration-200"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={generateExample}
                >
                  generate
                  {isHovered && (
                    <div
                      className="shadow absolute bg-white bg-opacity-30 rounded-full pointer-events-none transition-all duration-200"
                      style={{ left: shadowPosition.x, top: shadowPosition.y, width: '100px', height: '100px' }}
                    ></div>
                  )}
                </button>
              </div>
            </div>
          </div>
          :
          currentCase === 'exams' ?
            <div className="example_wrapper bg-gray-100 min-h-screen p-2 sm:p-4 md:p-8">
              <div className="topbar flex flex-col sm:flex-row justify-between items-center bg-white p-2 sm:p-4 shadow-md rounded-lg">
                <div className="top_left mb-2 sm:mb-0">
                  <h3 className="not_refresh text-base sm:text-xl">Please, don't refresh the page</h3>
                </div>
                <div className="top_right">
                  <h3 className="timer font-orbitron text-base sm:text-xl">{`${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`}</h3>
                </div>
              </div>
              <div className="container mt-4 sm:mt-8">
                <div className="example_header text-center mb-4 sm:mb-8">
                  <h4 className="example_header_txt text-2xl sm:text-3xl font-bold capitalize">Generated Examples</h4>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-4">
                  {examples?.map((ex: exampleProps, i: number) => (
                    <div className="exam_kol3 flex items-center justify-between bg-white p-2 sm:p-4 rounded-lg shadow-md" key={i}>
                      <input className="ex_question text-center text-2xl sm:text-3xl md:text-4xl lg:text-4xl w-full sm:w-1/2 md:w-1/3 lg:w-1/4 border bg-white border-gray-300 rounded p-1 sm:p-2" value={ex?.num1} type="text" readOnly />
                      <span className="operat text-2xl sm:text-3xl md:text-4xl lg:text-4xl mx-1 sm:mx-2">
                        {ex?.operation === 'addition' ? '+' : ex?.operation === 'subtraction' ? '-' : ex?.operation === 'multiplication' ? '×' : '÷'}
                      </span>
                      <input className="ex_question text-center text-2xl sm:text-3xl md:text-4xl lg:text-4xl w-full sm:w-1/2 md:w-1/3 lg:w-1/4 border bg-white border-gray-300 rounded p-1 sm:p-2" value={ex?.num2} type="text" readOnly />
                      <span className="equal text-2xl sm:text-3xl md:text-4xl lg:text-4xl mx-1 sm:mx-2">=</span>
                      <input className="response text-center text-2xl sm:text-3xl md:text-4xl lg:text-4xl w-full sm:w-1/2 md:w-1/3 lg:w-1/4 border bg-white border-gray-300 rounded p-1 sm:p-2" onChange={(e) => debouncedHandleInputChange(ex, e.target.value)} type="number" required />
                    </div>
                  ))}
                </div>
                <div className="finish_place text-center mt-4 sm:mt-8">
                  <button className="start_btn bg-blue-500 text-white py-2 sm:py-3 px-4 sm:px-8 rounded-md relative overflow-hidden hover:bg-blue-600 transition-all duration-200" onMouseMove={handleMouseMove} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => next(time)}>
                    finish
                    {isHovered && (
                      <div className="shadow absolute bg-white bg-opacity-30 rounded-full pointer-events-none transition-all duration-200" style={{ left: shadowPosition.x, top: shadowPosition.y, width: '50px', height: '50px' }}></div>
                    )}
                  </button>
                </div>
              </div>
            </div>
            :
            currentCase === 'summary' ?
              <div className="summary-wrapper bg-white">
                {scrollY >= 214 && (
                  <div className="topbar fixed top-0 left-0 right-0 bg-white shadow-md z-50 py-2 px-4 flex justify-between items-center" style={{ padding: `${topbarPadding}px 5px` }}>
                    <div className="top-left">
                      <h3 className="summ-correct-count text-lg font-bold">{summaries?.examplesCount}/{summaries?.totalCorrect}</h3>
                    </div>
                    <div className="top-right flex space-x-4">
                      <h3 className="summ-correct-percent text-lg font-bold">{summaries.percentCorrect}</h3>
                      <h3 className="summ-correct-percent text-lg font-bold">{`${summaries.min} min ${summaries.sec} sec`}</h3>
                    </div>
                  </div>
                )}

                <div className="container mx-auto py-5 px-4">
                  <div className="summary-top">
                    <div className="row pb-5">
                      <div className="col-md-12 flex flex-col items-center">
                        <img
                          className="summary-img w-32 h-32"
                          src={getSummaryImageSrc(summaries?.percentCorrect)}
                          alt="summary image"
                        />

                        <div className="summary-middle-place mt-4 text-center">
                          <h3 className="sum-total text-xl font-semibold">Total: {summaries?.examplesCount}/{summaries?.totalCorrect}</h3>
                          <h3 className="sum-common text-xl font-semibold">Common: {summaries?.percentCorrect}</h3>
                          <h3 className="sum-common text-xl font-semibold">
                            Finished: {`${summaries.min < 1 ? '' : `${summaries.min} min`} ${summaries.sec < 1 ? '' : `${summaries.sec} sec`}`}
                          </h3>

                        </div>

                        <div className="sum-finish-place mt-4 flex space-x-4">
                          <button
                            className={`start-btn py-2 px-4 bg-blue-500 text-white rounded ${isHovered ? 'bg-blue-700' : ''}`}
                            onMouseMove={handleMouseMove}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => { setIsReview(!isReview); play() }}
                            style={{ textTransform: 'capitalize' }}
                          >
                            review
                            {isHovered && (
                              <div
                                className="shadow absolute bg-blue-300 rounded-full"
                                style={{ left: shadowPosition.x, top: shadowPosition.y }}
                              ></div>
                            )}
                          </button>
                          <button
                            className={`start-btn py-2 px-4 bg-blue-500 text-white rounded ${isHovered1 ? 'bg-blue-700' : ''}`}
                            onMouseMove={handleMouseMove1}
                            onMouseEnter={handleMouseEnter1}
                            onMouseLeave={handleMouseLeave1}
                            onClick={restart}
                            style={{ textTransform: 'capitalize', marginLeft: '30px' }}
                          >
                            restart
                            {isHovered1 && (
                              <div
                                className="shadow absolute bg-blue-300 rounded-full"
                                style={{ left: shadowPosition1.x, top: shadowPosition1.y }}
                              ></div>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {isReview && (
                    <div className="row grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {summaries?.summaries?.map((s: summaryProps, i: number) => (
                        <div className="col-md-4 p-4 border rounded shadow-md text-xl" key={i}>
                          <div className="sum-question-place mb-2">
                            <h4 className="sum-question font-medium">{s?.num1} {s?.operation === 'addition' ? '+' : s?.operation === 'subtraction' ? '-' : s?.operation === 'multiplication' ? 'x' : ':'} {s?.num2} = ?</h4>
                          </div>
                          <div className="xyz mb-2">
                            <h5 className="sum-your-answer font-semibold">Your answer: </h5>
                            <h5 className="sum-correct-answer">{s?.userAnswer}</h5>
                          </div>
                          {!s?.isCorrect && (
                            <div className="xyz1 mb-2">
                              <h5 className="sum-ball-label font-semibold">Answer: </h5>
                              <h5 className="sum-ball">{s?.answer}</h5>
                            </div>
                          )}
                          <div className="xyz2">
                            <h5 className="sum-ball-label font-semibold">Score: </h5>
                            <h5 className={`sum-ball ${s?.isCorrect ? 'text-green-500' : 'text-red-500'}`}>{s?.isCorrect ? 1 : 0}</h5>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              :
              <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
                <h1 className="text-9xl font-extrabold text-gray-400 tracking-widest">404</h1>
                <div className="bg-blue-500 px-2 text-sm rounded rotate-12 absolute">
                  Page Not Found
                </div>
                <button className="mt-5">
                  <Link to="/" className="relative inline-block text-sm font-medium text-blue-500 group focus:outline-none focus:ring" onClick={goHome}>
                    <span className="absolute inset-0 transition-transform translate-x-0 translate-y-0 bg-blue-500 group-hover:translate-y-1.5 group-hover:translate-x-1.5"></span>
                    <span className="relative block px-8 py-3 bg-white border border-current">
                      Go Home
                    </span>
                  </Link>
                </button>
              </div>
      }

    </>
  )
}
