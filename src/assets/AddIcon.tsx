const AddIcon = () => {
  return (
    <div className="transition-colors duration-300 ease-in-out text-inherit">
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M60 10L60 110"
          stroke="currentColor"
          stroke-width="20"
          stroke-linecap="round"
        />
        <path
          d="M110 60L10 60"
          stroke="currentColor"
          stroke-width="20"
          stroke-linecap="round"
        />
      </svg>
    </div>
  );
};

export default AddIcon;
