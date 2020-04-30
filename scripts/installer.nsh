!macro customInstall
  DetailPrint "Register pixie URI Handler"
  DeleteRegKey HKCR "pixie"
  WriteRegStr HKCR "pixie" "" "URL:pixie"
  WriteRegStr HKCR "pixie" "URL Protocol" ""
  WriteRegStr HKCR "pixie\DefaultIcon" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
  WriteRegStr HKCR "pixie\shell" "" ""
  WriteRegStr HKCR "pixie\shell\Open" "" ""
  WriteRegStr HKCR "pixie\shell\Open\command" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME} %1"
!macroend
