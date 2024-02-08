import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

export function DialyzerIcon(props: SvgIconProps) {
  return (
    <SvgIcon width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M9 2H15V4H17C18.1046 4 19 4.89543 19 6V8C19 9.10457 18.1046 10 17 10V14C18.1046 14 19 14.8954 19 16V18C19 19.1046 18.1046 20 17 20H15V22H9V20H7C5.89543 20 5 19.1046 5 18V16C5 14.8954 5.89543 14 7 14L7 10C5.89543 10 5 9.10457 5 8V6C5 4.89543 5.89543 4 7 4H9V2ZM17 6H7L7 8H17V6ZM15 14V10L9 10L9 14H15ZM7 16L7 18H17V16H7Z"
        fill="evenodd"
      />
    </SvgIcon>
  );
}
