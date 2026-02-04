import React, { useContext, useState, useRef, useEffect } from "react";
import "./mailContent.css";
import { ThemeContext } from "../ThemeContext/ThemeContext";
import Quill from "quill";
import "quill/dist/quill.snow.css";
const BlockEmbed = Quill.import("blots/block/embed");
class AttachmentBlot extends BlockEmbed {
  static create(value) {
    let node = super.create();
    node.setAttribute("href", value.url);
    node.setAttribute("target", "_blank");
    node.setAttribute("rel", "noopener noreferrer");
    // node.setAttribute("download", value.fileName);
    // ".pdf,.ppt,.pptx,.doc,.docx"
    const extension = value.fileName?.split(".").pop()?.toLowerCase();
    const openInTabExtensions = ["pdf"];
    // const downloadExtensions = ["pdf", "ppt", "pptx", "doc", "docx"];
    const downloadExtensions = [
      "pdf",
      "ppt",
      "pptx",
      "doc",
      "docx",
      "jpg",
      "png",
      "gif",
      "jpeg",
      "bmp",
      "svg",
    ];

    // if (downloadExtensions.includes(extension)) {
    //   node.setAttribute("download", value.fileName);
    // }
    if (extension) {
      if (downloadExtensions.includes(extension)) {
        // Force download with original filename
        node.setAttribute("download", value.fileName);
      } else if (openInTabExtensions.includes(extension)) {
        // Do nothing — browser should open in new tab
        node.removeAttribute("download");
      } else {
        // For any other extensions, optionally decide here
        node.removeAttribute("download");
      }
    }

    node.classList.add("ql-attachment-link");
    node.textContent = value.fileName || "Attachment";
    return node;
  }

  static value(node) {
    return {
      url: node.getAttribute("href"),
      fileName: node.textContent,
    };
  }
}

AttachmentBlot.blotName = "attachment";
AttachmentBlot.tagName = "a";

Quill.register(AttachmentBlot);

const MailContent = ({ closeMail, sendMail, isMailData }) => {
  const [mailSubject, setMailSubject] = useState(isMailData.subject || "");
  const [mailBody, setMailBody] = useState(isMailData.text || "");
  const [isError, setError] = useState("");
  const { isTheme } = useContext(ThemeContext);
  const editorRef = useRef(null);
  const quillInstance = useRef(null);

  const handleSubjectChange = (e) => {
    setMailSubject(e.target.value);
  };

  const handleBodyChange = (e) => {
    setMailBody(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mailSubject && mailBody) {
      setError("");
      sendMail({ subject: mailSubject, body: mailBody });
    } else {
      setError("Please enter the Mail subject and body!");
    }
  };

  // useEffect(() => {
  //   if (editorRef.current) {
  //     editorRef.current.innerHTML = "";

  //     quillInstance.current = new Quill(editorRef.current, {
  //       theme: "snow",
  //       modules: {
  //         toolbar: "#toolbar",
  //       },
  //     });
  //     quillInstance.current.clipboard.dangerouslyPasteHTML(mailBody);

  //     quillInstance.current.on("text-change", () => {
  //       const html = editorRef.current.querySelector(".ql-editor").innerHTML;
  //       setMailBody(html === "<p><br></p>" ? "" : html);
  //     });
  //   }

  //   return () => {
  //     if (quillInstance.current) {
  //       quillInstance.current = null;
  //     }
  //   };
  // }, []);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = "";

      quillInstance.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: "#toolbar",
        },
        formats: [
          "bold",
          "italic",
          "underline",
          "link",
          "image",
          "list",
          // "bullet",
          "color",
          "attachment",
        ],
      });

      // Get the toolbar module
      const toolbar = quillInstance.current.getModule("toolbar");

      const attachButton = document.getElementById("attach-button");
      if (attachButton) {
        attachButton.addEventListener("click", () => {
          const quill = quillInstance.current;
          quill.focus();
          let range = quill.getSelection();

          if (!range) {
            const length = quill.getLength();
            quill.setSelection(length, 0);
            range = quill.getSelection();
          }
          const input = document.createElement("input");
          input.setAttribute("type", "file");
          input.setAttribute(
            "accept",
            ".pdf, .ppt, .pptx, .doc, .docx, .jpg, .png, .gif, .jpeg, .bmp, .svg"
          );
          // input.setAttribute("accept", ".pdf,.ppt,.pptx,.doc,.docx");
          input.click();

          input.onchange = () => {
            const file = input.files[0];
            if (file) {
              const reader = new FileReader();

              reader.onload = (e) => {
                const base64 = e.target.result;

                let insertRange = quill.getSelection();
                if (!insertRange) {
                  insertRange = { index: quill.getLength(), length: 0 };
                }

                quill.insertEmbed(
                  insertRange.index,
                  "attachment",
                  {
                    url: base64,
                    fileName: file.name,
                  },
                  "user"
                );
                quill.setSelection(insertRange.index + 1);
              };

              reader.readAsDataURL(file);
            }
          };
        });
      }

      // Now add the image handler safely
      toolbar.addHandler("image", () => {
        const quill = quillInstance.current;

        // Focus editor
        quill.focus();

        // Get current selection
        let range = quill.getSelection();

        if (!range) {
          const length = quill.getLength();
          quill.setSelection(length, 0);
          range = quill.getSelection();
        }

        // Create file input to pick image
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = () => {
          const file = input.files[0];
          if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
              const base64 = e.target.result;

              let insertRange = quill.getSelection();
              if (!insertRange) {
                insertRange = { index: quill.getLength(), length: 0 };
              }

              quill.insertEmbed(insertRange.index, "image", base64, "user");
              quill.setSelection(insertRange.index + 1);
            };

            reader.readAsDataURL(file);
          }
        };
      });

      quillInstance.current.clipboard.dangerouslyPasteHTML(mailBody);

      quillInstance.current.on("text-change", () => {
        const html = editorRef.current.querySelector(".ql-editor").innerHTML;
        // setMailBody(html === `<p><br></p>` ? "" : html);
        const emptyParagraph = `<p style="color: ${
          isTheme ? "white" : "black"
        };"><br></p>`;
        setMailBody(html.trim() === emptyParagraph ? "" : html);
      });
    }

    return () => {
      if (quillInstance.current) {
        quillInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleClick = (e) => {
      if (e.target.classList.contains("ql-attachment-link")) {
        e.preventDefault();
        const href = e.target.getAttribute("href");
        window.open(href, "_blank");
      } else if (e.target.classList.contains("attachment-remove-btn")) {
        e.preventDefault();

        const quill = quillInstance.current;
        if (!quill) return;

        const blotNode = e.target.parentNode;
        const blot = Quill.find(blotNode);

        if (blot) {
          blot.remove();
        }
      }
    };

    editor.addEventListener("click", handleClick);

    return () => {
      editor.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div>
      <div className="modal-overlay">
        <div
          className="modal-box mail-box"
          style={{
            backgroundColor: isTheme ? "black" : "white",
            border: isTheme ? "1px solid #8d8d8d" : "1px solid white",
          }}
        >
          <div className="schedule-box">
            <div className="heading-one">
              <h1 style={{ color: isTheme ? "white" : "#283e46" }}>
                {/* <img src="./src/assets/images/back.svg" width={20} alt="" /> */}
                <span
                  className={`back_icon_align back_btn-${
                    isTheme ? "dark" : "light"
                  }`}
                  onClick={closeMail}
                ></span>
                Mail Content
              </h1>

              {/* <img
                src="./src/assets/images/close-circle-svgrepo-com.svg"
                width={30}
                alt="Close"
                onClick={closeMail}
                style={{ cursor: "pointer" }}
              /> */}
            </div>
            <div>
              {isError && <div className="error-message">{isError}</div>}
            </div>
            <div className="formUI">
              <form className="form-div" onSubmit={handleSubmit}>
                <div className="mailPart">
                  <div>
                    <label
                      htmlFor="mailSubject"
                      style={{ color: isTheme ? "white" : "#283e46" }}
                    >
                      Mail Subject
                    </label>
                    <input
                      style={{ color: isTheme ? "#adb5bd" : "#343a40" }}
                      type="text"
                      name="mail_Subject"
                      id="mailSubject"
                      value={mailSubject}
                      onChange={handleSubjectChange}
                    />
                  </div>
                  <div style={{ color: isTheme ? "white" : "#283e46" }}>
                    <label
                      htmlFor="mailBody"
                      style={{ color: isTheme ? "white" : "#283e46" }}
                    >
                      Mail Body
                    </label>
                    {/* <textarea
                      style={{ color: isTheme ? "#adb5bd" : "#343a40" }}
                      name="mail_Body"
                      id="mailBody"
                      value={mailBody}
                      onChange={handleBodyChange}
                    /> */}

                    <div>
                      <div
                        id="toolbar"
                        className="ql-toolbar ql-snow"
                        style={{
                          backgroundColor: isTheme ? "white" : "white",
                        }}
                      >
                        <button className="ql-bold"></button>
                        <button className="ql-italic"></button>
                        <button className="ql-underline"></button>
                        <button className="ql-link"></button>
                        {/* <button className="ql-image"></button> */}
                        <button className="ql-list" value="ordered"></button>
                        <button className="ql-list" value="bullet"></button>
                        {/* <button className="ql-attachment">Attach</button> */}
                        <button type="button" id="attach-button">
                          <img
                            src="./src/assets/images/attachment.svg"
                            alt="tool-bar icons"
                          />
                          {/* <img src={isTheme ? "./src/assets/images/attachment-dark.svg" :"./src/assets/images/attachment.svg"} alt="" /> */}
                        </button>

                        {/* <select className="ql-color"></select> */}
                      </div>
                      <div ref={editorRef} style={{ height: "300px" }} />
                    </div>
                  </div>
                </div>
                <div className="button-hire">
                  <button
                    className="cancel-btn"
                    type="button"
                    onClick={closeMail}
                  >
                    <span className="cancel_btn cancel_icon_align "></span>
                    Cancel
                  </button>
                  <button className="submitButton" type="submit">
                    <span className="mail_btn mail_icon_align "></span>
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MailContent;
