import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import AWS from "aws-sdk";
import { Buffer } from "buffer";
// import "./styles.css";
import { saveAs } from 'file-saver';
import MaterialTable from "@material-table/core";
import './App.css'
import './MaterialTable.css'
import * as yup from "yup";
import { useFormik } from "formik";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useQuery } from "@tanstack/react-query";
import PropagateLoader from "react-spinners/PropagateLoader"
import useLocalStorage from "use-local-storage";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import Swal from 'sweetalert2'
//import Upload from './Upload'




const App = () => {
  const [file, setfile] = useState(null)
  const fileInputRef = useRef(null); 

  const [folderName, setfolderName] = useState([])
  const [fileType, setfileType] = useLocalStorage("fileType", "All")

  const [tableData, setTableData] = useState([]);

  AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: "us-east-1",
  });
  const S3 = new AWS.S3();


  const handleFileUpload = event => {
    console.log("event.target.files[0].name", event.target.files[0].name);
    console.log("event.target.files[0].name", event.target.files[0].type);
    console.log("event.target.value", event.target.value);
    setfile(event.target.files)
  };

  // const getData = async () => {
  //   try {
  //     const listAllKeys = (params, out = []) => new Promise((resolve, reject) => {
  //       S3.listObjectsV2(params).promise()
  //         .then(({ Contents, IsTruncated, NextContinuationToken }) => {
  //           out.push(...Contents);
  //           !IsTruncated ? resolve(out) : resolve(listAllKeys(Object.assign(params, { ContinuationToken: NextContinuationToken }), out));
  //         })
  //         .catch(reject);
  //     });

  //     listAllKeys({ Bucket: 'my-dms-bucket-osl1' })
  //       .then((data) => {
  //         // setobjData(data)
  //         // console.log(data)
  //         return data
  //         // console.log(data)
  //       })
  //       .catch(console.log);



  //   } catch (error) {

  //   }
  // }

  const getData = async () => {
    try {
      let finalData = [];
      await S3.listObjectsV2({ Bucket: "my-dms-bucket-new" }).promise().then(data => {
        for (let i = 0; i < data.Contents.length; i++) {
          const keyName = data.Contents[i].Key;
          const splitFolderName = keyName.substring(0, keyName.indexOf('/'));


          // console.log(data[i].Contents)
          if (fileType === splitFolderName) {
            console.log(fileType, splitFolderName)
            finalData.push(data.Contents[i])
            // console.log(fileType, splitFolderName)
          } else if (fileType === "All") {
            finalData.push(data.Contents[i])
          }
        }
        console.log(finalData)
        return finalData;
      }).catch(function (err) {
        console.warn('Not exist folder exception is not catch here!');
        return false;
      });
      // console.log(results.Contents[0].Key);
      // let folderName = [];
      // for (let i = 0; i < results.Contents.length; i++) {
      //   const keyName = results.Contents[i].Key;
      //   const splitFolderName = keyName.substring(0, keyName.indexOf('/'));
      //   // console.log(splitFolderName)
      //   folderName.push(splitFolderName)



      // }
      // setfolderName(folderName)

      return finalData;


    } catch (error) {

    }
  }

  const { isLoading, refetch } = useQuery(
    ['data'],
    getData,
    {
      onSuccess: (fetchedData) => setTableData(fetchedData),
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false
    }
  );


  console.log(folderName)


  // useEffect(() => {
  //   getData()
  // }, [])
  const colur = "red"
  const columns = [
    { title: "Key", field: "Key", width: "60%" },
    { title: "Storage Class", field: "StorageClass" },
    { title: "Size", field: "Size", },

  ];
  const actions = [
    {
      icon: () => <button className="button-7">Download</button>,
      onClick: async (event, rowData) => {
        try {
          Swal.fire({
            title: "Preparing download...",
            text: "Please wait while we fetch your file.",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
          const params = {
            Bucket: "my-dms-bucket-new",
            Key: rowData.Key,
            Expires: 60, // link valid for 1 minute
            ResponseContentDisposition: `attachment; filename="${rowData.Key.split("/").pop()}"`
          };

          // Get signed URL
          const url = S3.getSignedUrl("getObject", params);

          // Fetch file
          const response = await fetch(url);
          const blob = await response.blob();

          // Save using file-saver
          saveAs(blob, rowData.Key.split("/").pop());

          Swal.close();

        } catch (error) {
          console.error("Download failed:", error);
          Swal.fire({
            position: "top",
            icon: "error",
            title: "Download failed",
            text: error.message,
            showConfirmButton: true,
          });
        }
      },
    },
    {
      // icon: () => <button className="addbutton">Add</button>,
      icon: () => <button type="button" className="button-7">Delete</button>,


      // tooltip: "Add User",
      onClick: (event, rowData) => {

        try {
          const params = {
            Bucket: "my-dms-bucket-new",
            Key: rowData.Key
          };
          S3.deleteObject(params, function (err, data) {
            if (err) {
              console.log("Failed to delete", err);
              Swal.fire({
                position: "top",
                icon: "error",
                title: "Delete failed",
                text: err.message,
                showConfirmButton: true,
              });
            } else {
              console.log("File deleted successfully", data);
              
              // ✅ Remove the deleted file from tableData immediately
              setTableData(prevData => prevData.filter(item => item.Key !== rowData.Key));

              Swal.fire({
                position: "top",
                icon: "success",
                title: "Deleted successfully",
                showConfirmButton: false,
                timer: 1500,
              });
            }
          });
        } catch (error) {
          console.log("Delete exception", error);
        }
      },
    },
  ];


  const fileTypes = [
    {
      label: "Image",
      value: "Image",
    },
    {
      label: "PDF",
      value: "PDF",
    },
    {
      label: "XLX",
      value: "XLX",
    },
    {
      label: "DOC",
      value: "DOC",
    },
    {
      label: "Others",
      value: "Others",
    },
    {
      label: "All",
      value: "All",
    },
  ];

  const validationSchema = yup.object({

  });
  const formik = useFormik({
    initialValues: {
      file_type: "All"

    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {

    },
  });

  const submitFile = async event => {

    if (!file || file.length === 0) {
      return; // Stop execution
    }
    console.log("AWS Access Key:", process.env.REACT_APP_AWS_ACCESS_KEY_ID);
    console.log("AWS Secret Key:", process.env.REACT_APP_AWS_SECRET_ACCESS_KEY);
    console.log("Bucket:", process.env.REACT_APP_BUCKET_NAME);
    console.log("S3 Object:", S3);

    const formData = new FormData();
    formData.append("file", file[0]);





    const objParams = {
      Bucket: "my-dms-bucket-new",
      Key: fileType === "PDF" ?
        ("PDF" + "/" + file[0].name) : fileType === "XLX" ? ("XLX" + "/" + file[0].name) : fileType === "DOC" ? ("DOC" + "/" + file[0].name) : fileType === "Image" ? ("Image" + "/" + file[0].name) : fileType === "Other" ? ("Other" + "/" + file[0].name) : "",
      Body: file[0],
      // Body: file,
      ContentType: file[0].type,
      acl: 'private',
      contentDisposition: 'attachment',
      ServerSideEncryption: 'AES256'
    };

    console.log("Uploading file:", file[0].name);
    console.log("Key:", objParams.Key);
    console.log("Bucket:", objParams.Bucket);
    console.log("ContentType:", objParams.ContentType);

    const response = S3.upload(objParams)
      .on("httpUploadProgress", function (progress) {
        console.log(progress);
        console.log("loaded", progress.loaded);
        console.log("total", progress.total);
        console.log("httpUploadProgress");
      })
      .send(function (err, data) {
        if (err) {
          console.log("Something went wrong");
          console.log(err.code);
          console.log(err.message);
        } else {
          console.log("SEND FINISHED", JSON.stringify(data));
          refetch();
          setfile(null); // ✅ Clear selected file
          if (fileInputRef.current) {
            fileInputRef.current.value = "";   // ✅ safe reset without showing "No file selected"
          }
          Swal.fire({
            position: "top",
            icon: "success",
            title: "Uploaded successfully",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
  };

  // console.log(file)
  if (isLoading) {
    return (
      <>
        <div id="centerDiv">
          <PropagateLoader />
        </div>
      </>
    )
  }
  console.log(fileType)
  return (
    <>
      <div className="materialTableDB">


        {/* <img src={`data: image / png; base64, ${data} `} alt="" srcset="" /> */}
        <div>
          <div>
            <div className="pwd-container">
              {/* <div>
                <span>File Type:</span>
              </div> */}

              <div className="select">
                <select
                  // style={{ width: "100%", margin: "0" }}
                  name="file_type"
                  className="textSelectField"
                  fullWidth
                  select // label="Select"
                  value={fileType}
                  onChange={
                    async (e) => {
                      await setfileType(e.target.value)
                      refetch()
                    }
                  }
                  variant="standard"
                >
                  <option disabled value="">
                    Please select
                  </option>
                  {fileTypes.map((option) => {
                    return <option value={option.label}>{option.value}</option>;
                  })}
                </select>
                <div>
                  <p style={{ color: "#F44336", fontWeight: "400" }}>
                    {formik.touched.file_type && formik.errors.file_type}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {fileType === "All" ? "" :
            <>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div>
                  <input
                    type="file"
                    name="file-input"
                    id="file-input"
                    ref={fileInputRef}
                    className="file-input__input"
                    accept={
                      fileType === "PDF"
                        ? "application/pdf"
                        : fileType === "Image"
                        ? "image/*"
                        : fileType === "DOC"
                        ? ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        : fileType === "XLX"
                        ? ".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        : "*/*"
                    }
                    onChange={(e) => {
                      setfile(e.target.files);
                    }}
                  />
                  <label className="file-input__label" htmlFor="file-input">

                    <UploadFileIcon />
                    <span>Select file</span>
                  </label>
                </div>
                <button 
                  type="button" 
                  className="uploadBtn" 
                  onClick={() => {
                    if (!file || file.length === 0) {
                      Swal.fire({
                        position: "top",
                        icon: "warning",
                        title: "No file selected",
                        text: "Please select a file before uploading.",
                        showConfirmButton: true,
                      });
                      return;
                    }
                    submitFile();
                  }}
                >
                  <span>Upload</span> <span><CloudUploadIcon /></span>
                </button>
              </div>
              {file && file.length > 0 && <p>{file[0].name}</p>}

            </>
          }

          <div style={{ marginTop: "2rem" }} className="materialTable">
            <MaterialTable
              localization={{
                header: {
                  actions: "ACTIONS",
                },
                toolbar: {
                  exportCSVName: "Export some Excel format",
                  exportPDFName: "Export as pdf!!",
                },
              }}
              title="DMS Data"
              columns={columns}
              data={tableData}
              actions={actions}
              options={{
                exportMenu: [
                  {
                    label: "Export PDF",
                    exportFunc: (cols, datas) => ExportPdf(cols, datas, "Admin"),
                  },
                  {
                    label: "Export CSV",
                    exportFunc: (cols, datas) => ExportCsv(cols, datas, "Admin"),
                  },
                ],
                actionsColumnIndex: -1,
                exportButton: true,
                exportAllData: true,
              }} />
          </div>

        </div>
      </div >
    </>
  );

}

export default App;