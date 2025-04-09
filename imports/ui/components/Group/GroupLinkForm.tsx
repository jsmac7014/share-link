import React, { useEffect, useState } from "react";
import { Meteor } from "meteor/meteor";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Modal from "/imports/ui/components/Modal";

export default function GroupLinkForm() {
  const [url, setUrl] = useState("");
  const [preview, setPreview] = useState({
    title: "",
    description: "",
    imageLink: "https://placehold.co/40?text=Preview",
  });
  const [isDisabled, setIsDisabled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { groupId } = useParams();

  async function addLink() {
    try {
      // check if preview is empty
      if (preview.title === "" && preview.description === "") {
        toast.error("Please preview the link before adding it");
        return;
      }
      await Meteor.callAsync("insert.link", url, preview, groupId);
      toast.success("Link added successfully", { autoClose: 1000 });
    } catch (error) {
      console.error("Error adding link:", error);
      toast.error("Failed to add link", { autoClose: 1000 });
    }
    setUrl("");
    setPreview({ title: "", description: "", imageLink: "https://placehold.co/40?text=Preview" });
    setIsOpen(false);
  }

  async function previewLink() {
    try {
      const result = await Meteor.callAsync("preview.link", url);
      setPreview({
        title: result.title,
        description: result.description,
        imageLink: result.imageLink,
      });
    } catch (error) {
      console.error("Error previewing link:", error);
      toast.error("Failed to preview link");
    }
  }

  useEffect(() => {
    if (
      preview.title === "" &&
      preview.description === "" &&
      preview.imageLink === "https://placehold.co/40?text=Preview"
    ) {
      console.log("Preview is empty");
      setIsDisabled(true);
      return;
    } else {
      console.log("Preview is not empty");
      setIsDisabled(false);
    }
  }, [preview]);

  return (
    <div className="w-full flex flex-row gap-1 flex-wrap">
      <button
        className="inline-flex items-center gap-2 w-full p-3 rounded-lg border text-zinc-800 border-gray-200 bg-white hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
        onClick={() => setIsOpen(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          />
        </svg>
        Add new link
      </button>
      <Modal title={"Add new link!"} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="space-y-2">
          <div className="w-full h-fit flex flex-col bg-white gap-2">
            {!isDisabled && (
              <>
                <div className="flex flex-row gap-2">
                  <img
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    src={preview.imageLink}
                    alt={preview.title}
                    className="lg:w-32 lg:h-32 h-20 w-20 object-cover rounded-lg"
                  />
                  <div className="w-full h-full flex flex-col justify-between gap-1">
                    <input
                      onChange={(e) => setPreview({ ...preview, title: e.target.value })}
                      value={preview.title}
                      disabled={isDisabled}
                      type="text"
                      placeholder="Preview Title"
                      className="w-full p-2 border border-gray-200  rounded-lg focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 outline-none disabled:bg-white/50"
                    />
                    <textarea
                      onChange={(e) => setPreview({ ...preview, description: e.target.value })}
                      value={preview.description}
                      disabled={isDisabled}
                      placeholder="Preview Description"
                      rows={4}
                      className="w-full h-32 p-2 border border-gray-200  rounded-lg focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 outline-none disabled:bg-white/50"
                    />
                  </div>
                </div>
                <button
                  className="p-2 bg-blue-500 rounded-lg text-white w-full outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 disabled:bg-blue-500/50"
                  onClick={addLink}
                  disabled={isDisabled}
                >
                  Add
                </button>
              </>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              type="text"
              placeholder="Enter link"
              className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 outline-none"
            />
            <button
              className="p-2 bg-white rounded-lg text-zinc-800 hover:bg-gray-50 border border-gray-200 w-full outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
              onClick={previewLink}
            >
              Preview
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
