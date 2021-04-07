import {Link, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import DeleteIcon from '@material-ui/icons/Delete';

import {API_URL} from "../../../config";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  GridList,
  GridListTile,
  makeStyles,
  Typography
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    flexDirection: 'column',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
  },
  bold: {
    fontWeight: 'bold',
  },
  delete: {
    position: 'absolute',
    top: 5,
    right: 5,
    cursor: 'pointer',
  }
}));

const UsersDetail = () => {
  const classes = useStyles();

  const [hasError, setErrors] = useState(false);
  const [user, setUser] = useState({});
  const [medias, setMedias] = useState([]);
  const [messages, setMessages] = useState([]);

  let location = useLocation();

  async function fetchData() {
    const url = `${API_URL}${location.pathname}`;

    const res = await fetch(url);
    res
        .json()
        .then(res => setUser(res.data))
        .catch(err => setErrors(err));
  }

  async function fetchMedias() {
    let url = `${API_URL}${location.pathname}/medias`;

    const res = await fetch(url);
    res
        .json()
        .then(res => setMedias(res.data))
        .catch(err => setErrors(err));
  }

  async function fetchMessages() {
    let url = `${API_URL}${location.pathname}/messages`;

    const res = await fetch(url,);
    res
        .json()
        .then(res => setMessages(res.data))
        .catch(err => setErrors(err));
  }

  async function toggleAccount() {
    const url = `${API_URL}${location.pathname}/${user.isDeleted ? 'reactivate' : 'softdelete'}`;
    const res = await fetch(url);
    res
        .json()
        .then(res => setUser({...user, isDeleted: !user.isDeleted}))
        .catch(err => setErrors(err));
  }

  useEffect(() => {
    fetchData();
    fetchMedias();
    fetchMessages();
  }, []);

  const toggleAccountActivation = () => {
    toggleAccount();
  }

  const deleteImage = (id) => async () => {
    const url = `${API_URL}/medias/${id}`;
    const res = await fetch(url, {method: 'delete'});
    res
        .json()
        .then(res => setMedias(medias.filter(x => x.id !== id)))
        .catch(err => setErrors(err));
  }

  return <div className={classes.root}>
    <Link to="/">Back to users</Link>
    {user &&
    <Card>
      <CardContent>
        <Typography>
          name: {user.name}
        </Typography>
        <Typography>
          username: {user.username}
        </Typography>
        <Typography>
          country: {user.country}
        </Typography>
        <Typography>
          city: {user.city}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={toggleAccountActivation}>{user.isDeleted ? 'Reactivate account' : 'Deactivate account'}</Button>
      </CardActions>
    </Card>}
    {medias && <GridList cellHeight={160} className={classes.gridList} cols={3}>
      {medias.map((media) => (
          <GridListTile key={media.id} cols={media.cols || 1}>
            <img src={media.url} alt="media"/>
            <DeleteIcon className={classes.delete} onClick={deleteImage(media.id)} />
          </GridListTile>
      ))}
    </GridList>}
    <div>
      <h2>Messages sent</h2>
      <ul>
        {messages && user && messages.filter(x => x.senderId === user.id).map(message =>
            <li>{message.content} <span className={classes.bold}> sent to </span>{message.receiverId}</li>
        )}
      </ul>
    </div>
    <div>
      <h2>Messages received</h2>
      <ul>
        {messages && user && messages.filter(x => x.receiverId === user.id).map(message =>
            <li>{message.content} <span className={classes.bold}> received from </span>{message.senderId}</li>
        )}
      </ul>
    </div>
  </div>;
}

export default UsersDetail;
