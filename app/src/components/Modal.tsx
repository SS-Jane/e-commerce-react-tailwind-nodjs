export default function MyModal(props) {
  return (
    <>
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <dialog id={props.id} className="modal bg-white rounded-sm border border-stroke shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="modal-box text-black dark:text-white bg-white dark:bg-black">
          <h3 className="font-bold text-lg">{props.title}</h3>
          <p>{props.children}</p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>
            close
          </button>
        </form>
      </dialog>
    </>
  );
}
