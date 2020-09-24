import React from "react";
import { Text } from "ink";
import * as path from "path";
import { isFilePresent } from "../utils/fileSystem";
import { FileStatus, TestFile } from "../../types/exercises.types";

const Landing: React.FC<TestFile> = ({ testFileName }) => {
	if (testFileName) {
		const defaultExercisePath = path.join(
			process.cwd(),
			"exercises",
			testFileName.toLowerCase(),
		);
		const fileStatus: FileStatus = isFilePresent(
			defaultExercisePath,
			testFileName,
		);
		if (fileStatus === FileStatus.SUCCESS) {
			return (
				<Text>
					Hello <Text color="green">{testFileName}</Text>
				</Text>
			);
		} else if (fileStatus === FileStatus.INCONCLUSIVE) {
			return (
				<Text>
					<Text color="red">{testFileName}</Text> is inconclusive, please
					provide a uniquely identifiable test name
				</Text>
			);
		}
	}
	return (
		<Text>
			Invalid test <Text color="red">{testFileName}</Text> provided
		</Text>
	);
};

export default Landing;
