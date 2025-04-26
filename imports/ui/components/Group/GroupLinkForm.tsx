import React, { useEffect, useState, useRef } from "react";
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
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const addBtnRef = useRef<HTMLButtonElement>(null);
  const previewBtnRef = useRef<HTMLButtonElement>(null);

  const { groupId } = useParams();

  async function addLink() {
    setIsLoading(true);
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
    setIsLoading(false);
  }

  async function previewLink() {
    setIsLoading(true);
    try {
      const result = await Meteor.callAsync("preview.link", url);
      setPreview({
        title: result.title,
        description: result.description,
        imageLink: result.imageLink,
      });
      toast.success("Link previewed successfully", { autoClose: 1000 });
      setIsLoading(false);
    } catch (error) {
      console.error("Error previewing link:", error);
      toast.error("Failed to preview link");
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (
      preview.title === "" &&
      preview.description === "" &&
      preview.imageLink === "https://placehold.co/40?text=Preview"
    ) {
      console.log("Preview is empty");
      setIsVisible(true);
      return;
    } else {
      console.log("Preview is not empty");
      setIsVisible(false);
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
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
        Add new link
      </button>
      <Modal title={"Add new link!"} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="space-y-2">
          <div className="w-full h-fit flex flex-col bg-white gap-2">
            {!isVisible && (
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
                      type="text"
                      placeholder="Preview Title"
                      className="w-full p-2 border border-gray-200  rounded-lg focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 outline-none disabled:bg-white/50"
                    />
                    <textarea
                      onChange={(e) => setPreview({ ...preview, description: e.target.value })}
                      value={preview.description}
                      placeholder="Preview Description"
                      rows={4}
                      className="w-full h-32 p-2 border border-gray-200  rounded-lg focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 outline-none disabled:bg-white/50"
                    />
                  </div>
                </div>
                <button
                  className="p-2 bg-blue-500 rounded-lg text-white w-full outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 disabled:bg-blue-500/50"
                  onClick={addLink}
                  disabled={isLoading}
                  ref={addBtnRef}
                >
                  Add
                </button>
                <button
                  className="p-2 bg-white rounded-lg text-zinc-800 hover:bg-gray-50 border border-gray-200 w-full outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-zinc-500"
                  onClick={() => {
                    setPreview({
                      title: "",
                      description: "",
                      imageLink: "https://placehold.co/40?text=Preview",
                    });
                    setIsVisible(true);
                  }}
                >
                  Discard
                </button>
              </>
            )}
          </div>
          {isVisible && (
            <div className="flex flex-col gap-2">
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                type="text"
                placeholder="Enter link"
                className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 outline-none"
              />
              <button
                className="p-2 bg-white rounded-lg text-zinc-800 hover:bg-gray-50 border border-gray-200 w-full outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-zinc-500"
                onClick={previewLink}
                disabled={isLoading}
                ref={previewBtnRef}
              >
                Preview
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
