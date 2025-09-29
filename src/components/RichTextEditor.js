"use client";
import React, { useState, useRef, useEffect } from "react";

const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Write something amazing...",
  className = "",
  label = "",
  rows = 6,
  showPreviewButton = false,
}) => {
  const contentRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
  });

  // Handle content change
  const handleContentChange = () => {
    if (contentRef.current) {
      const htmlContent = contentRef.current.innerHTML;
      onChange(htmlContent);
    }
  };

  // Check current formatting state
  const checkFormattingState = () => {
    if (contentRef.current) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);

        // Check if we have selected text
        if (range.toString()) {
          // For selected text, check if the entire selection has the same formatting
          const isBold = checkSelectionFormatting(range, "b, strong");
          const isItalic = checkSelectionFormatting(range, "i, em");
          const isUnderline = checkSelectionFormatting(range, "u");
          const isStrikeThrough = checkSelectionFormatting(range, "s, strike");

          console.log("Selection formatting state:", {
            bold: isBold,
            italic: isItalic,
            underline: isUnderline,
            strikeThrough: isStrikeThrough,
          });

          setActiveFormats({
            bold: isBold,
            italic: isItalic,
            underline: isUnderline,
            strikeThrough: isStrikeThrough,
          });
        } else {
          // For cursor position, check current element
          const container = range.commonAncestorContainer;
          const element =
            container.nodeType === Node.ELEMENT_NODE
              ? container
              : container.parentElement;

          const isBold = element?.closest("b, strong") !== null;
          const isItalic = element?.closest("i, em") !== null;
          const isUnderline = element?.closest("u") !== null;
          const isStrikeThrough = element?.closest("s, strike") !== null;

          setActiveFormats({
            bold: isBold,
            italic: isItalic,
            underline: isUnderline,
            strikeThrough: isStrikeThrough,
          });
        }
      } else {
        // No selection, reset formatting state
        setActiveFormats({
          bold: false,
          italic: false,
          underline: false,
          strikeThrough: false,
        });
      }
    }
  };

  // Check if entire selection has specific formatting
  const checkSelectionFormatting = (range, selector) => {
    const selectedText = range.toString();
    if (!selectedText) return false;

    // Create a temporary container with the selected content
    const tempDiv = document.createElement("div");
    const clonedContents = range.cloneContents();
    tempDiv.appendChild(clonedContents);

    console.log(`Checking ${selector} in:`, tempDiv.innerHTML);

    // Check if any part of the selection has the specified formatting
    const elements = tempDiv.querySelectorAll(selector);
    const hasFormatting = elements.length > 0;

    console.log(
      `Found ${elements.length} ${selector} elements:`,
      hasFormatting
    );

    // Additional check: if the entire selection is wrapped in the formatting tag
    if (hasFormatting) {
      const allText = tempDiv.textContent.trim();
      let formattedText = "";

      elements.forEach((element) => {
        formattedText += element.textContent.trim();
      });

      // If all text is formatted, return true
      const isFullyFormatted = formattedText === allText;
      console.log(`Is fully formatted: ${isFullyFormatted}`);
      return isFullyFormatted;
    }

    return hasFormatting;
  };

  // Check if selection has any formatting at all
  const checkSelectionHasAnyFormatting = (range) => {
    const selectedText = range.toString();
    if (!selectedText) return false;

    const tempDiv = document.createElement("div");
    const clonedContents = range.cloneContents();
    tempDiv.appendChild(clonedContents);

    // Check for any formatting tags
    const hasFormatting =
      tempDiv.querySelector("b, strong, i, em, u, s, strike") !== null;
    return hasFormatting;
  };

  // Handle paste events to clean up formatting
  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  // Format text with toggle functionality (MS Word style)
  const formatText = (formatType) => {
    if (contentRef.current) {
      contentRef.current.focus();

      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();

        if (selectedText) {
          // Text is selected - check if it has this specific formatting
          const hasThisFormatting = checkSelectionFormatting(
            range,
            formatType === "bold"
              ? "b, strong"
              : formatType === "italic"
              ? "i, em"
              : formatType === "underline"
              ? "u"
              : "s, strike"
          );

          console.log(`Selected text: "${selectedText}"`);
          console.log(`Format type: ${formatType}`);
          console.log(`Has formatting: ${hasThisFormatting}`);

          if (hasThisFormatting) {
            // Remove this specific formatting
            console.log("Removing formatting...");
            removeSpecificFormatting(formatType, range);
            // Update activeFormats to reflect deactivation
            setActiveFormats((prev) => ({
              ...prev,
              [formatType === "bold"
                ? "bold"
                : formatType === "italic"
                ? "italic"
                : formatType === "underline"
                ? "underline"
                : "strikeThrough"]: false,
            }));
          } else {
            // Add this specific formatting
            console.log("Adding formatting...");
            addFormatting(formatType, range, selectedText);
            // Update activeFormats to reflect activation
            setActiveFormats((prev) => ({
              ...prev,
              [formatType === "bold"
                ? "bold"
                : formatType === "italic"
                ? "italic"
                : formatType === "underline"
                ? "underline"
                : "strikeThrough"]: true,
            }));
          }
        } else {
          // No text selected - check if button is already active
          const currentState =
            activeFormats[
              formatType === "bold"
                ? "bold"
                : formatType === "italic"
                ? "italic"
                : formatType === "underline"
                ? "underline"
                : "strikeThrough"
            ];

          if (currentState) {
            // Button is active - just deactivate it without applying formatting
            console.log("Deactivating button without applying formatting...");
            setActiveFormats((prev) => ({
              ...prev,
              [formatType === "bold"
                ? "bold"
                : formatType === "italic"
                ? "italic"
                : formatType === "underline"
                ? "underline"
                : "strikeThrough"]: false,
            }));
          } else {
            // Button is inactive - activate it for future typing
            console.log("Activating button for future typing...");
            setActiveFormats((prev) => ({
              ...prev,
              [formatType === "bold"
                ? "bold"
                : formatType === "italic"
                ? "italic"
                : formatType === "underline"
                ? "underline"
                : "strikeThrough"]: true,
            }));
          }
        }

        // Update content immediately
        handleContentChange();

        // Update formatting state after a short delay
        setTimeout(() => {
          checkFormattingState();
        }, 10);
      }
    }
  };

  // Check if current selection has specific formatting
  const checkCurrentFormatting = (formatType, range) => {
    const container = range.commonAncestorContainer;
    const element =
      container.nodeType === Node.ELEMENT_NODE
        ? container
        : container.parentElement;

    // Check if we're currently in a formatted element
    let isFormatted = false;
    switch (formatType) {
      case "bold":
        isFormatted = element?.closest("b, strong") !== null;
        break;
      case "italic":
        isFormatted = element?.closest("i, em") !== null;
        break;
      case "underline":
        isFormatted = element?.closest("u") !== null;
        break;
      case "strikeThrough":
        isFormatted = element?.closest("s, strike") !== null;
        break;
      default:
        isFormatted = false;
    }

    // Also check if the current activeFormats state matches
    const currentState =
      activeFormats[
        formatType === "bold"
          ? "bold"
          : formatType === "italic"
          ? "italic"
          : formatType === "underline"
          ? "underline"
          : "strikeThrough"
      ];

    return isFormatted || currentState;
  };

  // Add formatting to selected text
  const addFormatting = (formatType, range, selectedText) => {
    const selection = window.getSelection();
    let tag;

    switch (formatType) {
      case "bold":
        tag = "strong";
        break;
      case "italic":
        tag = "em";
        break;
      case "underline":
        tag = "u";
        break;
      case "strikeThrough":
        tag = "s";
        break;
      default:
        return;
    }

    console.log(`Adding ${formatType} formatting to: "${selectedText}"`);

    const newText = `<${tag}>${selectedText}</${tag}>`;
    console.log("New HTML:", newText);

    range.deleteContents();
    const fragment = range.createContextualFragment(newText);
    range.insertNode(fragment);

    console.log("After insertion, content:", contentRef.current.innerHTML);

    // Clear selection and maintain cursor position
    selection.removeAllRanges();
    const newRange = document.createRange();

    // Find the last text node in the inserted fragment
    let lastNode = fragment;
    while (
      lastNode.lastChild &&
      lastNode.lastChild.nodeType !== Node.TEXT_NODE
    ) {
      lastNode = lastNode.lastChild;
    }

    // Find a valid node to set the range after
    let targetNode = null;
    if (lastNode.lastChild && lastNode.lastChild.parentNode) {
      targetNode = lastNode.lastChild;
    } else if (lastNode.parentNode) {
      targetNode = lastNode;
    } else {
      // Fallback: find the last element in the document
      const allElements = contentRef.current.querySelectorAll("*");
      if (allElements.length > 0) {
        targetNode = allElements[allElements.length - 1];
      } else {
        targetNode = contentRef.current;
      }
    }

    if (targetNode && targetNode.parentNode) {
      newRange.setStartAfter(targetNode);
      newRange.collapse(true);
      selection.addRange(newRange);
    }
  };

  // Remove specific formatting from selected text
  const removeSpecificFormatting = (formatType, range) => {
    const selection = window.getSelection();
    const selectedText = range.toString();

    console.log(`Removing ${formatType} from: "${selectedText}"`);

    // Create a temporary container to hold the text
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = selectedText;

    console.log("Before removal:", tempDiv.innerHTML);

    // Remove specific formatting tags based on formatType
    let selector;
    switch (formatType) {
      case "bold":
        selector = "b, strong";
        break;
      case "italic":
        selector = "i, em";
        break;
      case "underline":
        selector = "u";
        break;
      case "strikeThrough":
        selector = "s, strike";
        break;
      default:
        return;
    }

    // Remove only the specific formatting tags
    const specificTags = tempDiv.querySelectorAll(selector);
    console.log(`Found ${specificTags.length} tags to remove`);

    specificTags.forEach((tag) => {
      const parent = tag.parentNode;
      while (tag.firstChild) {
        parent.insertBefore(tag.firstChild, tag);
      }
      parent.removeChild(tag);
    });

    console.log("After removal:", tempDiv.innerHTML);

    // Replace the selected text with text without specific formatting
    range.deleteContents();
    const textNode = document.createTextNode(tempDiv.textContent);
    range.insertNode(textNode);

    // Clear selection and maintain cursor position
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.setStartAfter(textNode);
    newRange.collapse(true);
    selection.addRange(newRange);
  };

  // Remove all formatting from selected text
  const removeFormatting = (formatType, range) => {
    const selection = window.getSelection();
    const selectedText = range.toString();

    // Create a temporary container to hold the text
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = selectedText;

    // Remove specific formatting tags based on formatType
    let selector;
    switch (formatType) {
      case "bold":
        selector = "b, strong";
        break;
      case "italic":
        selector = "i, em";
        break;
      case "underline":
        selector = "u";
        break;
      case "strikeThrough":
        selector = "s, strike";
        break;
      default:
        return;
    }

    // Remove only the specific formatting tags
    const specificTags = tempDiv.querySelectorAll(selector);
    specificTags.forEach((tag) => {
      const parent = tag.parentNode;
      while (tag.firstChild) {
        parent.insertBefore(tag.firstChild, tag);
      }
      parent.removeChild(tag);
    });

    // Replace the selected text with text without specific formatting
    range.deleteContents();
    const textNode = document.createTextNode(tempDiv.textContent);
    range.insertNode(textNode);

    // Clear selection and maintain cursor position
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.setStartAfter(textNode);
    newRange.collapse(true);
    selection.addRange(newRange);
  };

  // Insert list
  const insertList = (type) => {
    if (contentRef.current) {
      contentRef.current.focus();

      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);

        if (range.toString()) {
          // Text is selected - convert to list
          const selectedText = range.toString();
          const lines = selectedText.split("\n").filter((line) => line.trim());
          const listItems = lines
            .map((line) => `<li>${line.trim()}</li>`)
            .join("");
          const newText = `<${
            type === "insertOrderedList" ? "ol" : "ul"
          }>${listItems}</${type === "insertOrderedList" ? "ol" : "ul"}>`;

          range.deleteContents();
          const fragment = range.createContextualFragment(newText);
          range.insertNode(fragment);

          selection.removeAllRanges();
        } else {
          // No text selected - create empty list
          const newText = `<${
            type === "insertOrderedList" ? "ol" : "ul"
          }><li>Item 1</li><li>Item 2</li></${
            type === "insertOrderedList" ? "ol" : "ul"
          }>`;
          range.deleteContents();
          const fragment = range.createContextualFragment(newText);
          range.insertNode(fragment);

          selection.removeAllRanges();
        }

        setTimeout(() => {
          handleContentChange();
        }, 10);
      }
    }
  };

  // Insert link
  const insertLink = () => {
    const url = prompt("Enter URL:", "https://");
    if (url) {
      if (contentRef.current) {
        contentRef.current.focus();

        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const selectedText = range.toString() || "Link Text";

          const newText = `<a href="${url}">${selectedText}</a>`;

          range.deleteContents();
          const fragment = range.createContextualFragment(newText);
          range.insertNode(fragment);

          selection.removeAllRanges();

          setTimeout(() => {
            handleContentChange();
          }, 10);
        }
      }
    }
  };

  // Insert image
  const insertImage = () => {
    const url = prompt("Enter Image URL:", "https://");
    if (url) {
      if (contentRef.current) {
        contentRef.current.focus();
        const alt = prompt("Enter Alt Text:", "Image");
        const imgTag = `<img src="${url}" alt="${alt}" style="max-width: 100%; height: auto;" />`;
        document.execCommand("insertHTML", false, imgTag);
        setTimeout(() => {
          handleContentChange();
        }, 50);
      }
    }
  };

  // Clear formatting
  const clearFormatting = () => {
    if (contentRef.current) {
      contentRef.current.focus();
      document.execCommand("removeFormat", false, null);
      setTimeout(() => {
        checkFormattingState();
        handleContentChange();
      }, 50);
    }
  };

  // Insert heading
  const insertHeading = (level) => {
    if (contentRef.current) {
      contentRef.current.focus();
      document.execCommand("formatBlock", false, `h${level}`);
      setTimeout(() => {
        handleContentChange();
      }, 50);
    }
  };

  // Handle focus
  const handleFocus = () => {
    setIsFocused(true);
    setTimeout(() => {
      checkFormattingState();
    }, 10);
  };

  // Handle blur
  const handleBlur = () => {
    setIsFocused(false);
    handleContentChange();
  };

  // Handle selection change
  const handleSelectionChange = () => {
    if (isFocused && contentRef.current) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (contentRef.current.contains(range.commonAncestorContainer)) {
          checkFormattingState();
        }
      }
    }
  };

  // Handle key events
  const handleKeyDown = (e) => {
    // Handle Enter key for better list behavior
    if (e.key === "Enter") {
      setTimeout(() => {
        handleContentChange();
      }, 10);
    }
  };

  // Set initial content only once
  useEffect(() => {
    if (contentRef.current && value !== undefined && !isFocused) {
      if (value === "" || value === null) {
        contentRef.current.innerHTML = "<p><br></p>";
      } else {
        contentRef.current.innerHTML = value;
      }
    }
  }, [value, isFocused]);

  // Add selection change listener
  useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [isFocused]);

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
        {/* Heading Dropdown */}
        <div className="relative">
          <select
            onChange={(e) => e.target.value && insertHeading(e.target.value)}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            defaultValue=""
          >
            <option value="">Normal</option>
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
          </select>
        </div>

        {/* Text Formatting */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              formatText("bold");
            }}
            className={`p-2 rounded-md transition-colors ${
              activeFormats.bold
                ? "bg-yellow-500 text-white shadow-md"
                : "hover:bg-yellow-100"
            }`}
            title="Bold (Ctrl+B)"
          >
            <strong className="text-sm font-bold">B</strong>
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              formatText("italic");
            }}
            className={`p-2 rounded-md transition-colors ${
              activeFormats.italic
                ? "bg-yellow-500 text-white shadow-md"
                : "hover:bg-yellow-100"
            }`}
            title="Italic (Ctrl+I)"
          >
            <em className="text-sm italic">I</em>
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              formatText("underline");
            }}
            className={`p-2 rounded-md transition-colors ${
              activeFormats.underline
                ? "bg-yellow-500 text-white shadow-md"
                : "hover:bg-yellow-100"
            }`}
            title="Underline (Ctrl+U)"
          >
            <u className="text-sm underline">U</u>
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              formatText("strikeThrough");
            }}
            className={`p-2 rounded-md transition-colors ${
              activeFormats.strikeThrough
                ? "bg-yellow-500 text-white shadow-md"
                : "hover:bg-yellow-100"
            }`}
            title="Strikethrough"
          >
            <s className="text-sm line-through">S</s>
          </button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button
            type="button"
            onClick={() => insertList("insertOrderedList")}
            className="p-2 hover:bg-yellow-100 rounded-md transition-colors"
            title="Ordered List (123)"
          >
            <span className="text-sm font-mono text-gray-700">123</span>
          </button>
          <button
            type="button"
            onClick={() => insertList("insertUnorderedList")}
            className="p-2 hover:bg-yellow-100 rounded-md transition-colors"
            title="Unordered List (•••)"
          >
            <span className="text-sm text-gray-700">•••</span>
          </button>
        </div>

        {/* Blockquote */}
        <button
          type="button"
          className="p-2 hover:bg-yellow-100 rounded-md transition-colors"
          title="Blockquote"
          onMouseDown={(e) => {
            e.preventDefault();
            if (contentRef.current) {
              contentRef.current.focus();
              document.execCommand("formatBlock", false, "blockquote");
              setTimeout(() => {
                handleContentChange();
              }, 50);
            }
          }}
        >
          <span className="text-sm text-gray-700">"</span>
        </button>

        {/* Links and Images */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button
            type="button"
            onClick={insertLink}
            className="p-2 hover:bg-yellow-100 rounded-md transition-colors"
            title="Insert Link"
          >
            <span className="text-sm">🔗</span>
          </button>
          <button
            type="button"
            onClick={insertImage}
            className="p-2 hover:bg-yellow-100 rounded-md transition-colors"
            title="Insert Image"
          >
            <span className="text-sm">🖼️</span>
          </button>
        </div>

        {/* Clear Formatting */}
        <button
          type="button"
          onClick={clearFormatting}
          className="p-2 hover:bg-yellow-100 rounded-md transition-colors"
          title="Clear Formatting"
        >
          <span className="text-sm font-mono text-gray-700">Tx</span>
        </button>
      </div>

      {/* Direct Edit Area */}
      <div className="relative">
        <div
          ref={contentRef}
          contentEditable
          onInput={handleContentChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          onMouseUp={checkFormattingState}
          onClick={checkFormattingState}
          className={`html-content p-6 bg-gradient-to-br from-gray-50 to-white border-2 rounded-xl min-h-[200px] shadow-inner transition-all ${
            isFocused
              ? "border-yellow-400 ring-2 ring-yellow-400"
              : "border-gray-200 hover:border-yellow-300"
          }`}
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            lineHeight: "1.6",
            color: "#374151",
            outline: "none",
          }}
          suppressContentEditableWarning={true}
          data-placeholder={value ? "" : placeholder}
        />

        {/* Placeholder */}
        {!value && !isFocused && (
          <div
            className="absolute top-6 left-6 text-gray-400 pointer-events-none"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            {placeholder}
          </div>
        )}
      </div>

    
    </div>
  );
};

export default RichTextEditor;
