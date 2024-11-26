import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function MyModal(props) {
  return (
    <>
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <dialog id={props.id} className="modal z-1">
        <div className="modal-box text-black dark:text-white bg-white dark:bg-black">
          <div className="flex justify-between">
            <h3 className="font-bold text-lg">{props.title}</h3>
            <form method="dialog">
              <button ><FontAwesomeIcon icon={faXmark}/></button>
            </form>
          </div>

          <div>{props.children}</div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button id={props.id + '_btnClose'}>close</button>
        </form>
      </dialog>
    </>
  );
}
