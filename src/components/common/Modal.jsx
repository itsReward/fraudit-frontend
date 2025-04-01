import React, { Fragment, useRef, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FiX } from 'react-icons/fi';
import Button from './Button';

const Modal = ({
                   isOpen,
                   onClose,
                   title,
                   children,
                   footer,
                   size = 'md',
                   closeOnOverlayClick = true,
                   className = '',
                   contentClassName = '',
                   showCloseButton = true,
                   ...props
               }) => {
    const cancelButtonRef = useRef(null);

    // Handle ESC key to close modal
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    // Determine modal width based on size prop
    const sizeClasses = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-lg',
        lg: 'sm:max-w-2xl',
        xl: 'sm:max-w-4xl',
        full: 'sm:max-w-full sm:h-full sm:m-4',
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-10"
                onClose={closeOnOverlayClick ? onClose : () => {}}
                initialFocus={cancelButtonRef}
                {...props}
            >
                {/* Backdrop */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-secondary-900 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel
                                className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full ${sizeClasses[size]} ${className}`}
                            >
                                {/* Header */}
                                {title && (
                                    <div className="border-b border-secondary-200 px-4 py-3 sm:px-6 flex items-center justify-between">
                                        <Dialog.Title as="h3" className="text-lg font-medium text-secondary-900">
                                            {title}
                                        </Dialog.Title>
                                        {showCloseButton && (
                                            <button
                                                type="button"
                                                className="bg-white rounded-md text-secondary-400 hover:text-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                onClick={onClose}
                                            >
                                                <span className="sr-only">Close</span>
                                                <FiX className="h-6 w-6" aria-hidden="true" />
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* Content */}
                                <div className={`px-4 py-4 sm:px-6 ${contentClassName}`}>
                                    {children}
                                </div>

                                {/* Footer */}
                                {footer && (
                                    <div className="bg-secondary-50 px-4 py-3 sm:px-6 border-t border-secondary-200 flex sm:flex-row-reverse flex-wrap space-y-2 sm:space-y-0 gap-2">
                                        {footer}
                                    </div>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

// Common modal with Confirm/Cancel buttons
export const ConfirmModal = ({
                                 isOpen,
                                 onClose,
                                 onConfirm,
                                 title,
                                 children,
                                 confirmText = 'Confirm',
                                 cancelText = 'Cancel',
                                 confirmVariant = 'primary',
                                 isConfirmLoading = false,
                                 isConfirmDisabled = false,
                                 ...props
                             }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            footer={
                <>
                    <Button
                        variant={confirmVariant}
                        onClick={onConfirm}
                        isLoading={isConfirmLoading}
                        disabled={isConfirmDisabled || isConfirmLoading}
                    >
                        {confirmText}
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        className="mr-2"
                    >
                        {cancelText}
                    </Button>
                </>
            }
            {...props}
        >
            {children}
        </Modal>
    );
};

export default Modal;