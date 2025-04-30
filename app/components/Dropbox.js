import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCameraRetro, FaXmark } from 'react-icons/fa6';
import { imageDelete, imageUpload } from '../utils/imageUpload';

const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: 'border-box',
};

const thumbInner = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
};

export function Dropbox({ files, setFiles, reviewImages, setReviewImages, dictionary }) {
    const [rejected, setRejected] = useState([]);
    const [finalImages, setFinalImages] = useState([]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/*': [],
        },
        onDrop: async (acceptedFiles, rejectedFiles) => {
            // Filter out files that already exist in finalImages based on filename
            const uniqueFiles = acceptedFiles.filter((file) => {
                return !finalImages.some(
                    (image) => image.filename === file.name
                );
            });

            if (uniqueFiles.length) {
                setFiles((previousFiles) => [
                    ...previousFiles,
                    ...uniqueFiles.map((file) =>
                        Object.assign(file, {
                            preview: URL.createObjectURL(file),
                        })
                    ),
                ]);

                const formData = new FormData();
                uniqueFiles.forEach((file) => {
                    formData.append('images[]', file);
                });

                try {
                    const response = await imageUpload(formData);
                    const responseData = await response.json();
                    setFinalImages((prevImages) => [
                        ...prevImages,
                        ...responseData.uploaded_files,
                    ]);
                } catch (err) {
                    console.log('Error uploading images');
                }
            }

            if (rejectedFiles?.length) {
                setRejected((previousFiles) => [
                    ...previousFiles,
                    ...rejectedFiles,
                ]);
            }
        },
    });

    useEffect(() => {
        setReviewImages(finalImages);
    }, [finalImages, setReviewImages]);

    useEffect(() => {
        // Revoke the data uris to avoid memory leaks
        return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
    }, [files]);

    const removeFile = async (name, event) => {
        event.stopPropagation();
        setFiles((files) => files.filter((file) => file.name !== name));

        try {
            await imageDelete(name);
        } catch (err) {
            console.log('Error deleting image');
        }

        const filteredImages = finalImages.filter(
            (image) => image.filename !== name
        );
        setFinalImages(filteredImages);
    };

    const removeAll = () => {
        setFiles([]);
        setRejected([]);
    };

    const removeRejected = (name) => {
        setRejected((files) => files.filter(({ file }) => file.name !== name));
    };

    return (
        <section className="flex-auto dropbox">
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <div className="bg-white border border-[#D0D5DD] rounded-lg flex-auto p-10 cursor-pointer">
                    <div className="flex flex-col gap-[6px] justify-center items-center text-center">
                        <button className="text-2xl text-[#DC2B2B] text-center">
                            <FaCameraRetro />
                        </button>
                        <p className="text-sm text-[#DC2B2B] font-medium">
                            {dictionary.reviewImgUpload}
                        </p>
                    </div>
                    <aside className="grid grid-cols-4 gap-3 pt-4">
                        {files.map((file) => (
                            <div
                                style={thumb}
                                key={file.name}
                                className="relative"
                            >
                                <div style={thumbInner}>
                                    <Image
                                        src={file.preview}
                                        width={100}
                                        height={100}
                                        className="object-cover w-full h-full"
                                        alt=""
                                        onLoad={() => {
                                            URL.revokeObjectURL(file.preview);
                                        }}
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="absolute flex items-center justify-center w-5 h-5 text-white transition-colors bg-red-400 border rounded-full border-secondary-400 hover:bg-red-600 -top-1 -right-1 "
                                    onClick={(event) =>
                                        removeFile(file.name, event)
                                    }
                                >
                                    <FaXmark className="w-3 h-3 transition-colors" />
                                </button>
                            </div>
                        ))}
                    </aside>
                </div>
            </div>
        </section>
    );
}

export default Dropbox;
