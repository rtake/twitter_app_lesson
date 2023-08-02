import React, { useState, useEffect } from "react";
import styles from "./Post.module.css";
import { db } from "../firebase";
import firebase from "firebase/app";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MssageIcon from "@material-ui/icons/Message";
import SendIcon from "@material-ui/icons/Send";

const Post: React.FC = () => {
  return <div></div>;
};

export default Post;
