import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Box, Grid } from "@mui/material";
import Button from "@mui/material/Button";
import Nav from "./Nav";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const copy = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const item = sourceClone[droppableSource.index];

  destClone.splice(droppableDestination.index, 0, { ...item, id: uuid() });
  return destClone;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const Content = styled.div`
  // margin-right: 200px;
  // margin-left: 230px;
  width: 100%;
  height: 100vh;
`;

const Item = styled.div`
  // display: flex;
  user-select: none;
  padding: 0.5rem;
  // margin: 0 0 0.5rem 0;
  align-items: flex-start;
  align-content: flex-start;
  line-height: 1.5;
  border-radius: 3px;
  // background: #fff;
  background: #dadfd3;
  border: 1px ${(props) => (props.isDragging ? "dashed #000" : "solid #ddd")};
`;

const Clone = styled(Item)`
  ~ div {
    transform: none !important;
  }
`;

const Handle = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  user-select: none;
  margin: -0.5rem 0.5rem -0.5rem -0.5rem;
  padding: 0.5rem;
  line-height: 1.5;
  border-radius: 3px 0 0 3px;
  background: #fff;
  border-right: 1px solid #ddd;
  color: #000;
  width: 100%;
`;

const List = styled.div`
  border: 1px
    ${(props) => (props.isDraggingOver ? "dashed #000" : "solid #ddd")};
  // background: #fff;
  padding: 0.5rem 0.5rem 0;
  border-radius: 3px;
  flex: 0 0 150px;
  font-family: sans-serif;
`;

const Kiosk = styled(List)`
  // position: absolute;
  // top: 0;
  // right: 0;
  // bottom: 0;
  // position: absolute;
  // top: 0;
  // left: 0;
  // bottom: 0;
  // width: 100%;
`;

const Container = styled(List)`
  margin: 0.5rem 0.5rem 1.5rem;
`;

const Notice = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  padding: 0.5rem;
  margin: 0 0.5rem 0.5rem;
  border: 1px solid transparent;
  line-height: 1.5;
  color: #aaa;
`;

const Btn = styled.button`
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  margin: 0.5rem;
  padding: 0.5rem;
  color: #000;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 3px;
  font-size: 1rem;
  cursor: pointer;
`;

const ButtonText = styled.div`
  margin: 0 1rem;
`;

const ITEMS = [
  {
    id: uuid(),
    content: "Deal of the day",
    image1:
      "https://m.media-amazon.com/images/I/81Sf4G8NVlL._AC_UL480_QL65_.jpg",
    image2:
      "https://m.media-amazon.com/images/I/81t6x4CRv5L._AC_UL480_QL65_.jpg",
    image3:
      "https://m.media-amazon.com/images/I/71fDjhV8aiL._AC_UL480_QL65_.jpg",
  },
  {
    id: uuid(),
    content: "Top sellers",
    image1:
      "https://m.media-amazon.com/images/I/715H4Gmux7S._AC_UL480_FMwebp_QL65_.jpg",
    image2:
      "https://m.media-amazon.com/images/I/61DuXqC9+YS._AC_UL480_FMwebp_QL65_.jpg",
    image3:
      "https://m.media-amazon.com/images/I/71BqV3R0R2L._AC_UL480_FMwebp_QL65_.jpg",
  },
  {
    id: uuid(),
    content: "New arrivals",
    image1:
      "https://m.media-amazon.com/images/I/81rgPpu+bPL._AC_UL480_QL65_.jpg",
    image2:
      "https://m.media-amazon.com/images/I/71YWo0SMk5L._AC_UL480_QL65_.jpg",
    image3:
      "https://m.media-amazon.com/images/I/71YE5hLmhML._AC_UL480_QL65_.jpg",
  },
  {
    id: uuid(),
    content: "Trending now",
    image1:
      "https://m.media-amazon.com/images/I/617SyqzlSKL._AC_UL480_QL65_.jpg",
    image2:
      "https://m.media-amazon.com/images/I/511HG7M2enL._AC_UL480_QL65_.jpg",
    image3:
      "https://m.media-amazon.com/images/I/61hNt1KkDUL._AC_UL480_QL65_.jpg",
  },
];

const Home = (props) => {
  const [state, setState] = useState({
    [uuid()]: [],
  });

  const [btnShow, setBtnShow] = useState(false);
  const [right, setRight] = useState();
  const [text, setText] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    switch (source.droppableId) {
      case destination.droppableId:
        setState((prevState) => ({
          ...prevState,
          [destination.droppableId]: reorder(
            state[source.droppableId],
            source.index,
            destination.index
          ),
        }));
        break;
      case "ITEMS":
        setState((prevState) => ({
          ...prevState,
          [destination.droppableId]: copy(
            ITEMS,
            prevState[destination.droppableId],
            source,
            destination
          ),
        }));
        break;
      default:
        setState((prevState) => ({
          ...prevState,
          ...move(
            prevState[source.droppableId],
            prevState[destination.droppableId],
            source,
            destination
          ),
        }));
        break;
    }
    setBtnShow(false);
    // console.log(ITEMS[source.index])
  };

  const handleRemove = (id) => {
    let newData = Object.keys(state).map((el) =>
      state[el].filter((a) => a.id != id)
    );
    let newID = Object.keys(state);

    setState({ [newID]: newData[0] });
    setRight("");
    setBtnShow(false);
  };

  const handleSave = (content) => {
    let newID = Object.keys(state);
    let filterwdData = ITEMS.filter((el) => el.content === content);
    filterwdData.map((el) => {
      el.content = text || el.content;
      el.image1 = image1 || el.image1;
      el.image2 = image2 || el.image2;
      el.image3 = image3 || el.image3;
    });

    setState({ ...state, [newID]: filterwdData });
    setBtnShow(false);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Grid container spacing={0.1} backgroundColor="#dadfd3">
        <Grid item xs={3} height="100%">
          <Droppable droppableId="ITEMS" isDropDisabled={true}>
            {(provided, snapshot) => (
              <Kiosk
                ref={provided.innerRef}
                isDraggingOver={snapshot.isDraggingOver}
              >
                {ITEMS.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <React.Fragment>
                        <Item
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          isDragging={snapshot.isDragging}
                          style={provided.draggableProps.style}
                        >
                          <Box
                            bgcolor={"white"}
                            // bgcolor={"#dadfd3"}
                            m=".5rem"
                            p="1rem"
                            borderRadius={"5px"}
                          >
                            <h2
                              style={{ marginTop: "0px", marginBottom: "5px" }}
                            >
                              {item.content}
                            </h2>
                            <Box
                              display={"flex"}
                              justifyContent="space-around"
                              p=".5rem"
                            >
                              <img
                                src={item.image1}
                                height="120px"
                                width="70px"
                                border="1px solid black"
                              />
                              <img
                                src={item.image2}
                                height="120px"
                                width="70px"
                                border="1px solid black"
                              />
                              <img
                                src={item.image3}
                                height="120px"
                                width="70px"
                                border="1px solid black"
                              />
                            </Box>
                          </Box>
                        </Item>
                        {snapshot.isDragging && <Clone>{item.content}</Clone>}
                      </React.Fragment>
                    )}
                  </Draggable>
                ))}
              </Kiosk>
            )}
          </Droppable>
        </Grid>
        <Grid item xs={6} height="100%">
          <Content>
            <Nav />
            {Object.keys(state).map((list, i) => (
              <Droppable key={list} droppableId={list}>
                {(provided, snapshot) => (
                  <Container
                    ref={provided.innerRef}
                    isDraggingOver={snapshot.isDraggingOver}
                  >
                    {state[list].length
                      ? state[list].map((item, index) => {
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <Item
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  isDragging={snapshot.isDragging}
                                  style={provided.draggableProps.style}
                                >
                                  <Handle {...provided.dragHandleProps}>
                                    <svg
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="currentColor"
                                        d="M3,15H21V13H3V15M3,19H21V17H3V19M3,11H21V9H3V11M3,5V7H21V5H3Z"
                                      />
                                    </svg>
                                  </Handle>
                                  <Box
                                    bgcolor={"white"}
                                    mt=".5rem"
                                    ml="-8px"
                                    p="1rem"
                                    mr={"-.5rem"}
                                    onClick={() => setBtnShow(true)}
                                  >
                                    <h2
                                      style={{
                                        marginTop: "0px",
                                        marginBottom: "5px",
                                      }}
                                    >
                                      {item.content}
                                    </h2>
                                    <Box
                                      display={"flex"}
                                      justifyContent="space-around"
                                      p=".5rem"
                                    >
                                      <img
                                        src={item.image1}
                                        height="120px"
                                        width="70px"
                                        border="1px solid black"
                                      />
                                      <img
                                        src={item.image2}
                                        height="120px"
                                        width="70px"
                                        border="1px solid black"
                                      />
                                      <img
                                        src={item.image3}
                                        height="120px"
                                        width="70px"
                                        border="1px solid black"
                                      />
                                    </Box>
                                    {btnShow ? (
                                      <Box
                                        display={"flex"}
                                        gap="1rem"
                                        justifyContent="right"
                                      >
                                        <Button
                                          variant="contained"
                                          color="primary"
                                          onClick={() => {
                                            setRight(item);
                                          }}
                                        >
                                          Edit
                                        </Button>
                                        <Button
                                          onClick={() =>
                                            // window.location.reload()
                                            handleRemove(item.id)
                                          }
                                          variant="contained"
                                          color="error"
                                        >
                                          Remove
                                        </Button>
                                      </Box>
                                    ) : (
                                      ""
                                    )}
                                  </Box>
                                </Item>
                              )}
                            </Draggable>
                          );
                        })
                      : !provided.placeholder && (
                          <Notice>Drop items here</Notice>
                        )}
                    {provided.placeholder}
                  </Container>
                )}
              </Droppable>
            ))}
          </Content>
        </Grid>
        <Grid item xs={3} height="100%">
          {/* <Box
            bgcolor={"white"}
            // bgcolor={"#dadfd3"}
            m=".5rem"
            p="1rem"
            borderRadius={"5px"}
          >
            <h2 style={{ marginTop: "0px", marginBottom: "5px" }}>
              {right && right.content}
            </h2>
            {right &&<Box display={"flex"} justifyContent="space-around" p=".5rem">
              <img
                src={right && right.image1}
                height="120px"
                width="70px"
                border="1px solid black"
              />
              <img
                src={right && right.image2}
                height="120px"
                width="70px"
                border="1px solid black"
              />
              <img
                src={right && right.image3}
                height="120px"
                width="70px"
                border="1px solid black"
              />
            </Box>}
          </Box> */}
          <Box bgcolor={"white"} p="1rem" mt=".5rem" borderRadius={"5px"}>
            {right && <label>Text : </label>}
            {right && (
              <input
                type="text"
                defaultValue={right && right.content}
                onChange={(e) => setText(e.target.value)}
              />
            )}
            <br />
            {right && <label>Image 1 : </label>}
            {right && (
              <input
                type="text"
                defaultValue={right && right.image1}
                onChange={(e) => setImage1(e.target.value)}
              />
            )}
            <br />
            {right && <label>Image 2 : </label>}
            {right && (
              <input
                type="text"
                defaultValue={right && right.image2}
                onChange={(e) => setImage2(e.target.value)}
              />
            )}
            <br />
            {right && <label>Image 3 : </label>}
            {right && (
              <input
                type="text"
                defaultValue={right && right.image3}
                onChange={(e) => setImage3(e.target.value)}
              />
            )}
            {right && (
              <Button
                onClick={() => handleSave(right.content)}
                style={{ marginTop: "1rem" }}
                variant="contained"
                color="success"
              >
                Save
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </DragDropContext>
  );
};

export default Home;
