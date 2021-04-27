import React from "react";

import UserDetails from "./UserDetails";
import Description from "./Description";
import TagsBox from "./TagsBox";

import { FileProps } from "../../../types";
import styles from "./AdditionalDetailsCell.module.scss";

interface DetailsProps {
  file: FileProps;
}

function AdditionalDetailsCell({ file }: DetailsProps) {
  return (
    <div className={styles.Cell}>
      <UserDetails
        userID={file?.user.id}
        walletAddress={file?.user.wallet_id}
        avatar={file?.user.avatar}
      />
      <Description descriptionHash={file?.info.description} />
      <TagsBox tags={file?.tags} />
    </div>
  );
}

export default AdditionalDetailsCell;
