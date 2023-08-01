import React, { useEffect } from "react";
import styles from "./App.module.css";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, login, logout } from "./features/userSlice";
import { auth } from "./firebase";

const App: React.FC = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    // 認証情報変更時に実行するコールバック関数を登録
    // unSubにはこの関数をアンマウントするための関数が入る
    const unSub = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(
          login({
            uid: authUser.uid,
            photoUrl: authUser.photoURL,
            diaplayName: authUser.displayName,
          })
        );
      } else {
        dispatch(logout());
      }
    });

    // クリーンアップ時にこの関数を実行
    return unSub();
  }, []);

  return <div className="App"></div>;
};

export default App;
