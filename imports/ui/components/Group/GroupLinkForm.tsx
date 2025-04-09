import React, { useEffect, useState } from "react";
import { Meteor } from "meteor/meteor";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

export default function GroupLinkForm() {
  const [url, setUrl] = useState("");
  const [preview, setPreview] = useState({
    title: "",
    description: "",
    imageLink: "https://placehold.co/40?text=Preview",
  });
  const [isDisabled, setIsDisabled] = useState(true);

  const { groupId } = useParams();

  async function addLink() {
    try {
      await Meteor.callAsync("insert.link", url, preview, groupId);
      toast.success("Link added successfully", { autoClose: 1000 });
    } catch (error) {
      console.error("Error adding link:", error);
      toast.error("Failed to add link", { autoClose: 1000 });
    }
    setUrl("");
    setPreview({ title: "", description: "", imageLink: "https://placehold.co/40?text=Preview" });
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
      preview.imageLink === "https://placehold.co/400"
    ) {
      setIsDisabled(true);
      return;
    } else {
      setIsDisabled(false);
    }
  }, [preview]);

  return (
    <div className="w-full flex flex-row gap-1 flex-wrap">
      {/* Preview */}
      <div className="w-full flex flex-col bg-white rounded-lg p-3 gap-2 shadow-sm border border-gray-200">
        <h1 className="text-lg font-semibold text-zinc-800">Preview</h1>
        <div className="flex flex-row gap-2">
          <img
            loading="lazy"
            referrerPolicy="no-referrer"
            sizes=""
            src={preview.imageLink}
            alt={preview.title}
            className="w-32 h-32 object-cover rounded-lg"
          />
          <div className="w-full h-full flex flex-col justify-between gap-1">
            <input
              onChange={(e) => setPreview({ ...preview, title: e.target.value })}
              value={preview.title}
              disabled={isDisabled}
              type="text"
              placeholder="Preview Title"
              className="w-full p-2 border  border-gray-200  rounded-lg focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 outline-none disabled:bg-white/50"
            />
            <textarea
              onChange={(e) => setPreview({ ...preview, description: e.target.value })}
              value={preview.description}
              disabled={isDisabled}
              placeholder="Preview Description"
              rows={4}
              className="w-full min-h-32 p-2 border  border-gray-200  rounded-lg focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 outline-none disabled:bg-white/50"
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
      </div>
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
  );
}
