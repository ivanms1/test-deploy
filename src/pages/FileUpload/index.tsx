import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { useHistory } from "react-router";

import Button from "../../components/Button";
import CategorySelect from "../../components/Select/CategorySelect";
import Dropzone from "../../components/Dropzone";
import FormInput from "../../components/Form/HookForm/FormInput";
import FormTextArea from "../../components/Form/HookForm/FormTextArea";
import Modal from "../../components/Modal";
import TagsSelect from "../../components/Select/TagsSelect";
import ThumbnailEditor from "../../components/ThumbnailEditor";
import TypeSelect from "../../components/Select/TypeSelect";
import SubmitButton from "./SubmitButton";

import getFileExtension from "../../helpers/getFileExtension";

import LeftArrow from "../../assets/icons/left-arrow.svg";

import styles from "./FileUpload.module.scss";

const { api } = window;

const FORM_DEFAULT_VALUES = {
  title: "",
  file: "",
  thumbnail: "",
  description: "",
  tags: [],
  category: null,
  type: null,
};

interface UploadFormData {
  title: string;
  file: any;
  thumbnail: any;
  description: string;
  tags: { value: string; label: string }[];
  category: { value: string; label: string };
  type: { value: string; label: string };
}

function FileUpload() {
  const [thumbImg, setThumbImg] = useState("");

  const history = useHistory();

  const { mutateAsync: uploadFile } = useMutation((data: any) =>
    api.uploadFile({
      title: data?.title,
      category: data?.category?.value,
      type: data?.type?.value,
      description: data?.description,
      tags: data?.tags?.map((t) => t.value),
      filePath: data?.file?.path,
      previewPath: data?.thumbnail,
      fileName: data?.file?.name,
      ext: getFileExtension(data?.file?.name),
      size: data?.file?.size,
    })
  );
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UploadFormData>({
    defaultValues: FORM_DEFAULT_VALUES,
  });

  const onSubmit: SubmitHandler<UploadFormData> = async (data) => {
    await uploadFile(data);
  };

  return (
    <div className={styles.FileUpload}>
      <Button
        noStyle
        onClick={() => history.goBack()}
        className={styles.BackButton}
      >
        <LeftArrow className={styles.Icon} />
      </Button>
      <p className={styles.Title}>Upload New Content</p>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.Form}>
        <div className={styles.InputsBox}>
          <div className={styles.UploadSection}>
            <div className={styles.AddFileInput}>
              <p className={styles.InputLabel}>1. Add File (Max. 2Gb)</p>
              <Controller
                control={control}
                name="file"
                render={({ field: { onChange, value } }) => (
                  <Dropzone
                    currentFile={value}
                    className={styles.DropzoneFile}
                    onDrop={(files) => onChange(files[0])}
                    maxSize={2147483648}
                    rejectMessage="File too large: Max file size is 2Gb."
                    label="Drop your file"
                  />
                )}
                rules={{
                  required: { value: true, message: "A file is required" },
                }}
              />
              {errors?.file && (
                <span className={styles.FileError}>
                  {errors?.file?.message}
                </span>
              )}
            </div>
            <div className={styles.AddThumbnailInput}>
              <p className={styles.InputLabel}>2. Add Thumbnail</p>
              <Controller
                control={control}
                name="thumbnail"
                render={({ field: { onChange, value } }) => (
                  <>
                    <Dropzone
                      currentFile={value}
                      className={styles.DropzoneThumbnail}
                      onDrop={(files) => setThumbImg(files[0])}
                      label="Drop your thumbnail"
                      withPreview
                      accept=".png, .jpg, .jpeg"
                    />
                    <Modal isOpen={!!thumbImg} onClose={() => setThumbImg("")}>
                      <ThumbnailEditor
                        origImage={thumbImg}
                        boxHeight={315}
                        boxWidth={570}
                        boxRadius={5}
                        handleUploadProcess={(scaledImage) => {
                          onChange(scaledImage);
                          setThumbImg("");
                        }}
                      />
                    </Modal>
                  </>
                )}
                rules={{
                  required: { value: true, message: "A thumbnail is required" },
                }}
              />
              {errors?.thumbnail && (
                <span className={styles.FileError}>
                  {errors?.thumbnail?.message}
                </span>
              )}
            </div>
          </div>
          <div className={styles.ContentInfoSection}>
            <FormInput
              className={styles.Input}
              label="3. Content Title"
              register={register("title", {
                required: { value: true, message: "A title is required" },
                maxLength: { value: 50, message: "Max 50 characters" },
              })}
              error={errors.title}
            />
            <FormTextArea
              className={styles.TextArea}
              label="4. Content Description"
              register={register("description", {
                required: { value: true, message: "A description is required" },
              })}
              error={errors.description}
            />
            <div className={styles.SelectContainer}>
              <p className={styles.InputLabel}>5. Add Tags</p>
              <Controller
                name="tags"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TagsSelect
                    value={value}
                    onChange={onChange}
                    isMulti
                    formatCreateLabel={(value) => `Add new ${value} tag`}
                    createOptionPosition="first"
                    placeholder=""
                  />
                )}
                rules={{
                  validate: {
                    maxTags: (v) => (v?.length ?? 0) <= 5 || "Max 5 tags",
                  },
                }}
              />
              {errors?.tags && (
                <span className={styles.Error}>{errors?.tags?.message}</span>
              )}
            </div>
            <div className={styles.SelectContainer}>
              <p className={styles.InputLabel}>6. Select Category</p>
              <Controller
                name="category"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <CategorySelect value={value} onChange={onChange} />
                )}
                rules={{
                  required: {
                    value: true,
                    message: "A category is required",
                  },
                }}
              />
              {errors?.category && (
                <span className={styles.Error}>
                  {errors?.category?.message}
                </span>
              )}
            </div>
            <div className={styles.SelectContainer}>
              <p className={styles.InputLabel}>6. Select Type</p>
              <Controller
                name="type"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TypeSelect value={value} onChange={onChange} />
                )}
                rules={{
                  required: {
                    value: true,
                    message: "A type is required",
                  },
                }}
              />
              {errors?.type && (
                <span className={styles.Error}>{errors?.type?.message}</span>
              )}
            </div>
          </div>
        </div>
        <SubmitButton reset={reset} />
      </form>
    </div>
  );
}

export default FileUpload;
