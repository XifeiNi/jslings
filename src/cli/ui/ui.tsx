import React from "react";
import { Text } from "ink";
import * as path from "path";
import { isFilePresent } from "../utils/fileSystem";
import { TestFile } from "../../types/exercises.types";

const App: React.FC<TestFile> = ({ testFileName }) => {
  const defaultExercisePath = path.join(
    process.cwd(),
    "exercises",
    testFileName.toLowerCase(),
  );
  if (isFilePresent(defaultExercisePath, testFileName)) {
    return (
      <Text>
        Hello <Text color="green">{testFileName}</Text>
      </Text>
    );
  } else {
    return <Text color="red">No test found</Text>;
  }
};

export default App;
