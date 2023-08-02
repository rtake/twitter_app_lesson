import React, { useState } from "react";
import styles from "./TweetInput.module.css";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { auth, storage, db } from "../firebase";
import { Avatar, Button, IconButton } from "@material-ui/core";
import firebase from "firebase/app";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";

const TweetInput: React.FC = () => {
  const user = useSelector(selectUser);
  const [tweetImage, setTweetImage] = useState<File | null>(null);
  const [tweetMsg, setTweetMsg] = useState("");
  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTweetImage(e.target.files![0]);
    e.target.value = "";
  };
  const sendTweet = (e: React.FormEvent<HTMLFormElement>) => {
    // submitが実行されたときにリフレッシュされるのを防ぐ
    e.preventDefault();

    // Tweetに画像がある場合と無い場合で条件分岐
    if (tweetImage) {
      // 画像の保存
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const N = 16;
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");
      const fileName = randomChar + "_" + tweetImage.name;

      // アップロードの返り値
      const uploadTweetImage = storage
        .ref(`images/${fileName}`)
        .put(tweetImage);

      // ストレージにおける後処理を定義
      uploadTweetImage.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        () => {}, // 進捗管理

        // エラー処理
        (err) => {
          alert(err.message);
        },

        // 正常終了した場合には, アップロードした画像のURLを取得
        async () => {
          await storage
            .ref("images")
            .child(fileName)
            .getDownloadURL()
            .then(async (url) => {
              // Tweetのメッセージを保存
              await db.collection("posts").add({
                avatar: user.photoUrl,
                image: url,
                text: tweetMsg,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                username: user.displayName,
              });
            });
        }
      );
    } else {
      db.collection("posts").add({
        avatar: user.photoUrl,
        image: "",
        text: tweetMsg,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        username: user.displayName,
      });
    }

    // 投稿後に状態を初期化
    setTweetImage(null);
    setTweetMsg("");
  };
  return (
    <>
      <form onSubmit={sendTweet}>
        <div className={styles.tweet_form}>
          <Avatar
            className={styles.tweet_avatar}
            src={user.photoUrl}
            onClick={async () => {
              await auth.signOut();
            }}
          />
          <input
            className={styles.tweet_input}
            placeholder="What'shappening?"
            type="text"
            autoFocus
            value={tweetMsg}
            onChange={(e) => setTweetMsg(e.target.value)}
          />
          <IconButton>
            <label>
              <AddAPhotoIcon
                className={
                  tweetImage ? styles.tweet_addIconLoaded : styles.tweet_addIcon
                }
              />
              <input
                className={styles.tweet_hiddenIcon}
                type="file"
                onChange={onChangeImageHandler}
              />
            </label>
          </IconButton>
        </div>
        <Button
          type="submit"
          disabled={!tweetMsg}
          className={
            tweetMsg ? styles.twet_sendBtn : styles.tweet_sendDisableBtn
          }
        >
          Tweet
        </Button>
      </form>
    </>
  );
};

export default TweetInput;
