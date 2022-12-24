import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Box } from "@mui/material";

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
/**
 * Moves an item from one list to another list.
 */
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
`;

const Item = styled.div`
  display: flex;
  user-select: none;
  padding: 0.5rem;
  margin: 0 0 0.5rem 0;
  align-items: flex-start;
  align-content: flex-start;
  line-height: 1.5;
  border-radius: 3px;
  background: #fff;
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
`;

const List = styled.div`
  border: 1px
    ${(props) => (props.isDraggingOver ? "dashed #000" : "solid #ddd")};
  background: #fff;
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

const Button = styled.button`
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

// const grid = 8;

const ITEMS = [
  {
    id: uuid(),
    content: "Text Field",
    image1:
      "https://m.media-amazon.com/images/I/81Sf4G8NVlL._AC_UL480_QL65_.jpg",
    image2:
      "https://m.media-amazon.com/images/I/81t6x4CRv5L._AC_UL480_QL65_.jpg",
    image3:
      "https://m.media-amazon.com/images/I/71fDjhV8aiL._AC_UL480_QL65_.jpg",
  },
  {
    id: uuid(),
    content: "Email",
  },
  {
    id: uuid(),
    content: "File",
  },
  {
    id: uuid(),
    content: "Radio",
  },
  {
    id: uuid(),
    content: "Select",
  },
];

const Sample = (props) => {
  const [state, setState] = useState({
    [uuid()]: [],
  });

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
  };

  const addList = () => {
    setState((prevState) => ({ ...prevState, [uuid()]: [] }));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box display={"flex"}>
        
        <Content>
          <Button onClick={addList}>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"
              />
            </svg>
            <ButtonText>Add List</ButtonText>
          </Button>
          {Object.keys(state).map((list, i) => (
            <Droppable key={list} droppableId={list}>
              {(provided, snapshot) => (
                <Container
                  ref={provided.innerRef}
                  isDraggingOver={snapshot.isDraggingOver}
                >
                  {state[list].length
                    ? state[list].map((item, index) => (
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
                                <svg width="24" height="24" viewBox="0 0 24 24">
                                  <path
                                    fill="currentColor"
                                    d="M3,15H21V13H3V15M3,19H21V17H3V19M3,11H21V9H3V11M3,5V7H21V5H3Z"
                                  />
                                </svg>
                              </Handle>
                              <Box
                                bgcolor={"white"}
                                m=".5rem"
                                p="1rem"
                                borderRadius={"5px"}
                                onClick={()=>console.log("Inside div")}
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
                              </Box>
                            </Item>
                          )}
                        </Draggable>
                      ))
                    : !provided.placeholder && <Notice>Drop items here</Notice>}
                  {provided.placeholder}
                </Container>
              )}
            </Droppable>
          ))}
        </Content>
      </Box>
    </DragDropContext>
  );
};

export default Sample;
