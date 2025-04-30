import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';

// import announcment from "@/assets/images/announcement.jpg";
import { X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getAnnouncement } from '../utils/getAnnouncement';
import KarbarCountdown from './KarbarCountdown';

const Announcement = () => {
    const [announcement, setAnnouncement] = useState(null);
    const [isTextOpen, setIsTextOpen] = useState(true);
    const [isBannerOpen, setIsBannerOpen] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(true);

    // const is_countdown = true;

    useEffect(() => {
        const fetchAnnouncement = async () => {
            const announcementData = await getAnnouncement();
            setAnnouncement(announcementData.data);
        };

        fetchAnnouncement();
    }, []);

    if (!announcement) return null;

    return (
        <div>
            {announcement?.textAnnounce && isTextOpen && (
                <div className="bg-purple-900">
                    <div className="container">
                        <div className="flex items-center justify-between py-4">
                            {announcement?.textAnnounce?.marque ? (
                                <div className="flex items-center justify-between w-full gap-5 text-white">
                                    <marquee className="w-full text-white">
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: announcement
                                                    ?.textAnnounce?.text,
                                            }}
                                        />
                                    </marquee>
                                    {announcement?.is_countdown && (
                                        <div>
                                            <KarbarCountdown
                                                endingDate={
                                                    announcement?.end_date
                                                }
                                            />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center justify-between w-full gap-5 text-white">
                                    <div
                                        className="w-full text-white"
                                        dangerouslySetInnerHTML={{
                                            __html: announcement?.textAnnounce
                                                ?.text,
                                        }}
                                    />
                                    {announcement?.is_countdown && (
                                        <div>
                                            <KarbarCountdown
                                                endingDate={
                                                    announcement?.end_date
                                                }
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                            <button
                                onClick={() => setIsTextOpen(false)}
                                className="flex items-center justify-center w-10 h-10 p-2 ml-4 text-white rounded-full hover:bg-purple-800"
                                aria-label="Close announcement"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {announcement?.bannerAnnounce && isBannerOpen && (
                <div className="relative overflow-hidden">
                    <button
                        className="absolute z-50 flex items-center justify-center w-10 h-10 p-2 rounded-full top-4 right-4 bg-black/50 hover:bg-black/70"
                        onClick={() => setIsBannerOpen(false)}
                        aria-label="Close banner announcement"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                    <Link
                        href={announcement?.bannerAnnounce?.url}
                        className="relative z-10 block w-full"
                        aria-label="View banner announcement details"
                    >
                        <Image
                            src={announcement?.bannerAnnounce?.image}
                            alt="announcement"
                            className="object-fill w-full h-auto"
                            width={1920}
                            height={1080}
                        />
                    </Link>
                </div>
            )}
            {announcement?.modalAnnounce && isModalOpen && (
                <div>
                    <Dialog
                        open={isModalOpen}
                        onOpenChange={setIsModalOpen}
                    >
                        <DialogHeader className="sr-only">
                            <DialogTitle>Announcement</DialogTitle>
                            <DialogDescription>
                                Announcement Image
                            </DialogDescription>
                        </DialogHeader>
                        <DialogContent hideClose className="max-w-[350px] max-h-[250px] sm:max-w-[800px] sm:max-h-[500px] p-0 overflow-hidden border-0">
                            <button
                                className="absolute z-50 flex items-center justify-center w-10 h-10 p-2 rounded-full top-4 right-4 bg-black/50 hover:bg-black/70"
                                onClick={() => setIsModalOpen(false)}
                                aria-label="Close modal announcement"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                            <Link
                                href={announcement?.modalAnnounce?.url}
                                className="block"
                                aria-label="View announcement promotion details"
                            >
                                <Image
                                    src={announcement?.modalAnnounce?.image}
                                    alt="announcement"
                                    className="object-fill w-full h-full"
                                    width={1920}
                                    height={1080}
                                />
                            </Link>
                        </DialogContent>
                    </Dialog>
                </div>
            )}
        </div>
    );
};

export default Announcement;
