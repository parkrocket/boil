import React, { useEffect, useState } from "react";
import axios from "axios";

function Subscribe(props) {
  const [SubscribeNumber, setSubscribeNumber] = useState(0);
  const [Subscribed, setSubscribed] = useState(false);
  const userId = localStorage.getItem("userId");
  console.log(userId);

  useEffect(() => {
    const variable = { userTo: props.userTo };
    axios.post("/api/subscribe/subscribeNumber", variable).then((response) => {
      if (response.data.success) {
        setSubscribeNumber(response.data.subscribeNumber);
      } else {
        alert("구독자 정보를 가져오는데 실패했습니다.");
      }
    });

    const subscribeVariable = { userTo: props.userTo, userFrom: userId };

    axios
      .post("/api/subscribe/subscribed", subscribeVariable)
      .then((response) => {
        if (response.data.success) {
          setSubscribed(response.data.subscribed);
        } else {
          alert("구독자 정보를 가져오는데 실패했습니다.");
        }
      });
  }, []);

  const onSubscribe = () => {
    const subscribedVariable = {
      userTo: props.userTo,
      userFrom: props.userFrom,
    };
    console.log(subscribedVariable);

    if (Subscribed) {
      //이미구독중일때
      axios
        .post("/api/subscribe/unSubscribe", subscribedVariable)
        .then((response) => {
          if (response.data.success) {
            setSubscribeNumber(SubscribeNumber - 1);
            setSubscribed(!Subscribed);
          } else {
            alert("구독 취소 실패");
          }
        });
    } else {
      //구독중이 아닐때
      axios
        .post("/api/subscribe/Subscribe", subscribedVariable)
        .then((response) => {
          if (response.data.success) {
            setSubscribeNumber(SubscribeNumber + 1);
            setSubscribed(!Subscribed);
          } else {
            alert("구독 하기 실패");
          }
        });
    }
  };
  return (
    <div>
      <button
        style={{
          backgroundColor: `${Subscribed ? "#AAAAAA" : "#CC0000"}`,
          //backgroundColor: "#cc0000",
          borderRadius: "4px",
          color: "#fff",
          padding: "10px 16px",
          fontWeight: "500",
          fontSize: "1rem",
          textTransform: "uppercase",
          border: "0px",
        }}
        onClick={onSubscribe}
      >
        {Subscribed ? "구독중" : "구독"} {SubscribeNumber}
      </button>
    </div>
  );
}

export default Subscribe;
